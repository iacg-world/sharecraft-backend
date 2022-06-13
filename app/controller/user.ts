import { Controller } from 'egg'
import { sign, verify } from 'jsonwebtoken'
const userCreateRules = {
  username: 'email',
  password: { type: 'password', min: 6 },
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
  validateUserInput() {
    const { ctx, app } = this
    // ctx.validate(userCreateRules)
    const errors = app.validator.validate(userCreateRules, ctx.request.body)
    ctx.logger.warn(errors)
    return errors
  }
  async loginByEmail() {
    const { ctx, service, app } = this
    // 检查用户的输入
    const error = this.validateUserInput()
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
    const token = sign({ username: user.username }, app.config.jwt.secret, {
      expiresIn: 60 * 60,
    })
    ctx.helper.success({ ctx, res: { token }, msg: '登录成功' })
  }

  async show() {
    const { ctx, service, app } = this
    // const { username } = ctx.session
    // /users/:id
    // const username = ctx.cookies.get('username', { encrypt: true })
    // const userData = await service.user.findById(ctx.params.id)
    const userData = await service.user.findByUsername(ctx.state.user.username)
    ctx.helper.success({ ctx, res: userData.toJSON() })
  }
}
