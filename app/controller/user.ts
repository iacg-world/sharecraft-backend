import { Controller } from 'egg'
const userCreateRules = {
  username: 'email',
  password: { type: 'password', min: 6 },
}
export const userErrorMessages = {
  createUserValidateFail: {
    errno: 101001,
    message: '创建用户验证失败',
  },
  // 创建用户，用户已经存在
  createUserAlreadyExists: {
    errno: 101002,
    message: '该邮箱已经被注册，请直接登录',
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
        errorType: 'createUserValidateFail',
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
  async show() {
    const { ctx, service } = this
    // /users/:id
    const userData = await service.user.findById(ctx.params.id)
    ctx.helper.success({ ctx, res: userData })
  }
}
