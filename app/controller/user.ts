import { Controller } from 'egg'
const userCreateRules = {
  username: 'email',
  password: { type: 'password', min: 8 },
}

export default class UserController extends Controller {
  async createByEmail() {
    const { ctx, service, app } = this
    // ctx.validate(userCreateRules)
    const errors = app.validator.validate(userCreateRules, ctx.request.body)
    ctx.logger.warn(errors)
    if (errors) {
      return ctx.helper.error({ ctx, errno: 10001, msg: '验证错误' })
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
