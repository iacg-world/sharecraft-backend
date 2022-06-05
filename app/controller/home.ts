import { Controller } from 'egg'

export default class HomeController extends Controller {
  public async index() {
    const { ctx } = this
    const { baseUrl } = this.app.config
    ctx.body = await ctx.service.test.sayHi('egg' + baseUrl)
  }

  public async getDog() {
    const { ctx, service } = this

    const resp = await service.dog.show()
    // ctx.helper.success({ ctx, res: resp })
    const res = await this.app.axiosInstance.get('/api/breeds/image/random')
    console.log('axios', res.data)
    await ctx.render('test.nj', { url: resp.message })
  }
}
