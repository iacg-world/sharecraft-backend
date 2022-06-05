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
    // NONE，DEBUG，INFO，WARN 和 ERROR
    const res = await this.app.axiosInstance.get('/api/breeds/image/random')
    ctx.logger.debug('debug info')
    ctx.logger.info('res data', res.data)
    ctx.logger.warn('warnning')
    ctx.logger.error(new Error('whoops'))
    console.log('axios', res.data)
    await ctx.render('test.nj', { url: resp.message })
  }
}
