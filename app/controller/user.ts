import { Controller } from 'egg'

export default class UserController extends Controller {
  async createByEmail() {
    const { ctx, service } = this
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
