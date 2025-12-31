import { Service } from 'egg'
import { UserProps } from '../model/user'
import Dypnsapi20170525, * as $Dypnsapi20170525 from '@alicloud/dypnsapi20170525'
import { RuntimeOptions } from '@alicloud/tea-util'
import { Config } from '@alicloud/credentials'
interface GiteeUserResp {
  id: number
  login: string
  name: string
  avatar_url: string
  email: string
}

export default class UserService extends Service {
  public createClient(): Dypnsapi20170525 {
    const credentialsConfig = new Config({
      type: 'access_key',
      endpoint: 'dypnsapi.aliyuncs.com',
      accessKeyId: process.env.ALC_ACCESS_KEY,
      accessKeySecret: process.env.ALC_SECRET_KEY,
    })
    return new Dypnsapi20170525(credentialsConfig)
  }
  public async createByEmail(payload: UserProps) {
    const { ctx } = this
    const { username, password } = payload
    const hashPassword = await ctx.genHash(password)

    const userCreatedData: Partial<UserProps> = {
      username,
      nickName: username.replace(/(\w{1,3})\w+(\w{1,2}@\w+\.\w+)/, '$1***$2'),
      password: hashPassword,
      email: username,
    }
    return ctx.model.User.create(userCreatedData)
  }
  async findById(id: string) {
    return this.ctx.model.User.findById(id)
  }
  async findByUsername(username: string) {
    return this.ctx.model.User.findOne({ username })
  }
  async sendSMS(phoneNumber: string, veriCode: string) {
    const client = this.createClient()
    const { app } = this
    // 配置参数
    const sendSMSRequest = new $Dypnsapi20170525.SendSmsVerifyCodeRequest({
      signName: '速通互联验证码',
      templateCode: 100001,
      phoneNumber,
      templateParam: `{\"code\":\"${veriCode}\", \"min\":\"5\"}`,
    })

    const runtime = new RuntimeOptions({})

    try {
      const resp = await client.sendSmsVerifyCodeWithOptions(
        sendSMSRequest,
        runtime,
      )
      app.logger.info(resp)
      return resp
    } catch (error) {
      console.error(error)
    }
  }
  async loginByCellphone(cellphone: string) {
    const { ctx, app } = this
    const user = await this.findByUsername(cellphone)
    // 检查 user 记录是否存在
    if (user) {
      // generate token
      const token = app.jwt.sign(
        { username: user.username, _id: user._id },
        app.config.jwt.secret,
      )
      return token
    }
    // 新建一个用户
    const userCreatedData: Partial<UserProps> = {
      username: cellphone,
      phoneNumber: cellphone,
      nickName: `sharecraft${cellphone.slice(-4)}`,
      type: 'cellphone',
    }
    const newUser = await ctx.model.User.create(userCreatedData)
    const token = app.jwt.sign(
      { username: newUser.username, _id: user._id },
      app.config.jwt.secret,
    )
    return token
  }
  // get access token
  async getAccessToken(code: string) {
    const { ctx, app } = this
    const { cid, secret, redirectURL, authURL } = app.config.giteeOauthConfig
    const { data } = await ctx.curl(authURL, {
      method: 'POST',
      contentType: 'json',
      dataType: 'json',
      data: {
        code,
        client_id: cid,
        redirect_uri: redirectURL,
        client_secret: secret,
      },
    })
    app.logger.info(data)
    return data.access_token
  }
  // get gitee user data
  async getGiteeUserData(access_token: string) {
    const { ctx, app } = this
    const { giteeUserAPI } = app.config.giteeOauthConfig
    const { data } = await ctx.curl<GiteeUserResp>(
      `${giteeUserAPI}?access_token=${access_token}`,
      {
        dataType: 'json',
      },
    )
    return data
  }
  async loginByGitee(code: string) {
    const { ctx, app } = this
    // 获取 access_token
    const accessToken = await this.getAccessToken(code)
    // 获取用户的信息
    const user = await this.getGiteeUserData(accessToken)
    // 检查用户信息是否存在
    const { id, name, avatar_url, email } = user
    const stringId = id.toString()
    // Gitee + id
    // Github + id
    // WX + id
    // 假如已经存在
    const existUser = await this.findByUsername(`Gitee${stringId}`)
    if (existUser) {
      const token = app.jwt.sign(
        { username: existUser.username, _id: existUser._id },
        app.config.jwt.secret,
      )
      return token
    }
    // 假如不存在，新建用户
    const userCreatedData: Partial<UserProps> = {
      oauthID: stringId,
      provider: 'gitee',
      username: `Gitee${stringId}`,
      picture: avatar_url,
      nickName: name,
      email,
      type: 'oauth',
    }
    const newUser = await ctx.model.User.create(userCreatedData)
    const token = app.jwt.sign(
      { username: newUser.username, _id: newUser._id },
      app.config.jwt.secret,
    )
    return token
  }
}
