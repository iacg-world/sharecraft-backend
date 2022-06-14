import { Controller } from 'egg'
import { sign, verify } from 'jsonwebtoken'
const userCreateRules = {
  username: 'email',
  password: { type: 'password', min: 6 },
}
const sendCodeRules = {
  phoneNumber: {
    type: 'string',
    format: /^1[3-9]\d{9}$/,
    message: '手机号码格式错误',
  },
}
const userPhoneCreateRules = {
  phoneNumber: {
    type: 'string',
    format: /^1[3-9]\d{9}$/,
    message: '手机号码格式错误',
  },
  veriCode: { type: 'string', format: /^\d{4}$/, message: '验证码格式错误' },
}

export const userErrorMessages = {
  userValidateFail: {
    errno: 101001,
    message: '输入信息验证失败',
  },
  // 创建用户，用户已经存在
  createUserAlreadyExists: {
    errno: 101002,
    message: '该邮箱已经被注册，请直接登录',
  },
  // 用户不存在或者密码错误
  loginCheckFailInfo: {
    errno: 101003,
    message: '该用户不存在或者密码错误',
  },
  loginValidateFail: {
    errno: 101004,
    message: '登录校验失败',
  },
  // 发送短信验证码过于频繁
  sendVeriCodeFrequentlyFailInfo: {
    errno: 101005,
    message: '请勿频繁获取短信验证码',
  },
  // 登录时，验证码不正确
  loginVeriCodeIncorrectFailInfo: {
    errno: 101006,
    message: '验证码不正确',
  },
  // 验证码发送失败
  sendVeriCodeError: {
    errno: 101007,
    message: '验证码发送失败',
  },
  // gitee 授权出错
  giteeOauthError: {
    errno: 101008,
    message: 'gitee 授权出错',
  },
}

export default class UserController extends Controller {
  async createByEmail() {
    const { ctx, service, app } = this
    // ctx.validate(userCreateRules)
    const errors = app.validator.validate(userCreateRules, ctx.request.body)
    ctx.logger.warn(errors)
    if (errors) {
      return ctx.helper.error({
        ctx,
        errorType: 'userValidateFail',
        error: errors,
      })
    }
    const { username } = ctx.request.body
    const user = await service.user.findByUsername(username)
    if (user) {
      return ctx.helper.error({ ctx, errorType: 'createUserAlreadyExists' })
    }
    const userData = await service.user.createByEmail(ctx.request.body)
    ctx.helper.success({ ctx, res: userData })
  }
  validateUserInput(rules: any) {
    const { ctx, app } = this
    // ctx.validate(userCreateRules)
    const errors = app.validator.validate(rules, ctx.request.body)
    ctx.logger.warn(errors)
    return errors
  }
  async sendVeriCode() {
    const { ctx, app } = this
    const { phoneNumber } = ctx.request.body
    // 检查用户输入
    const error = this.validateUserInput(sendCodeRules)
    if (error) {
      return ctx.helper.error({ ctx, errorType: 'userValidateFail', error })
    }
    // 获取 redis 的数据
    // phoneVeriCode-1331111222
    const preVeriCode = await app.redis.get(`phoneVeriCode-${phoneNumber}`)
    // 判断是否存在
    if (preVeriCode) {
      return ctx.helper.error({
        ctx,
        errorType: 'sendVeriCodeFrequentlyFailInfo',
      })
    }
    // [0 - 1)
    // [0 - 1) * 9000 = [0 - 9000)
    // [0 - 9000) + 1000 = [1000, 10000)
    const veriCode = Math.floor(Math.random() * 9000 + 1000).toString()
    // 发送短信
    // 判断是否为生产环境
    // https://www.eggjs.org/zh-CN/basics/env#%E4%B8%8E-node_env-%E7%9A%84%E5%8C%BA%E5%88%AB
    console.log(app.config.aliCloudConfig)

    if (app.config.env === 'prod') {
      const resp = await this.service.user.sendSMS(phoneNumber, veriCode)
      if (resp.body.code !== 'OK') {
        return ctx.helper.error({ ctx, errorType: 'sendVeriCodeError' })
      }
    }
    console.log(app.config.aliCloudConfig)
    await app.redis.set(`phoneVeriCode-${phoneNumber}`, veriCode, 'ex', 60)
    ctx.helper.success({
      ctx,
      msg: '验证码发送成功',
      res: app.config.env === 'dev' ? { veriCode } : null,
    })
  }
  async loginByEmail() {
    const { ctx, service, app } = this
    // 检查用户的输入
    const error = this.validateUserInput(userCreateRules)
    if (error) {
      return ctx.helper.error({ ctx, errorType: 'userValidateFail', error })
    }
    // 根据 username 取得用户信息
    const { username, password } = ctx.request.body
    const user = await service.user.findByUsername(username)
    // 检查用户是否存在
    if (!user) {
      return ctx.helper.error({ ctx, errorType: 'loginCheckFailInfo' })
    }
    const verifyPwd = await ctx.compare(password, user.password)
    // 验证密码是否成功
    if (!verifyPwd) {
      return ctx.helper.error({ ctx, errorType: 'loginCheckFailInfo' })
    }
    // ctx.cookies.set('username', user.username, { encrypt: true })
    // ctx.session.username = user.username
    // Registered claims 注册相关的信息
    // Public claims 公共信息: should be unique like email, address or phone_number
    const token = app.jwt.sign(
      { username: user.username },
      app.config.jwt.secret,
      { expiresIn: 60 * 60 },
    )
    ctx.helper.success({ ctx, res: { token }, msg: '登录成功' })
  }
  async loginByCellphone() {
    const { ctx, app } = this
    const { phoneNumber, veriCode } = ctx.request.body
    // 检查用户输入
    const error = this.validateUserInput(userPhoneCreateRules)
    if (error) {
      return ctx.helper.error({ ctx, errorType: 'userValidateFail', error })
    }
    // 验证码是否正确
    const preVeriCode = await app.redis.get(`phoneVeriCode-${phoneNumber}`)
    if (veriCode !== preVeriCode) {
      return ctx.helper.error({
        ctx,
        errorType: 'loginVeriCodeIncorrectFailInfo',
      })
    }
    const token = await ctx.service.user.loginByCellphone(phoneNumber)
    ctx.helper.success({ ctx, res: { token } })
  }
  async oauth() {
    const { app, ctx } = this
    const { cid, redirectURL } = app.config.giteeOauthConfig

    ctx.redirect(
      `https://gitee.com/oauth/authorize?client_id=${cid}&redirect_uri=${redirectURL}&response_type=code`,
    )
  }
  async oauthByGitee() {
    const { ctx } = this
    const { code } = ctx.request.query
    console.log(code)
    try {
      const token = await ctx.service.user.loginByGitee(code)
      await ctx.render('success-oauth.nj', { token })
    } catch (e) {
      return ctx.helper.error({ ctx, errorType: 'giteeOauthError' })
    }
  }
  async show() {
    const { ctx, service, app } = this
    // const { username } = ctx.session
    // /users/:id
    // const username = ctx.cookies.get('username', { encrypt: true })
    // const userData = await service.user.findById(ctx.params.id)
    // const token = this.getTokenValue()
    // if (!token) {
    //   return ctx.helper.error({ ctx, errorType: 'loginValidateFail' })
    // }
    // try {
    //   const decoded = verify(token, app.config.secret)
    //   ctx.helper.success({ ctx, res: decoded })
    // } catch (e) {
    //   return ctx.helper.error({ ctx, errorType: 'loginValidateFail' })
    // }
    const userData = await service.user.findByUsername(ctx.state.user.username)
    ctx.helper.success({ ctx, res: userData.toJSON() })
  }
}
