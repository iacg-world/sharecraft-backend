import { Controller } from 'egg'

export default class HomeController extends Controller {
  public async index() {
    const { ctx } = this
    ctx.body = await ctx.service.test.sayHi('egg')
  }

  public async getDog() {
    const { ctx, service } = this

    const resp = await service.dog.show()
    await ctx.render('test.nj', { url: resp.message })
  }
}
