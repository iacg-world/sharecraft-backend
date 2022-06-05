import { IBoot, Application } from 'egg'

export default class AppBoot implements IBoot {
  private readonly app: Application
  constructor(app: Application) {
    this.app = app
  }
  configWillLoad() {
    // 此时 config 文件已经被读取并合并，但是还并未生效
    // 这是应用层修改配置的最后时机
    // console.log('config', this.app.config.baseUrl)
    // console.log('enable middleware', this.app.config.coreMiddleware)
    this.app.config.coreMiddleware.unshift('myLogger')
  }
  async willReady() {
    console.log('enable willready', this.app.config.coreMiddleware)
  }
  async didReady() {
    // const ctx = await this.app.createAnonymousContext()
    // const res = await ctx.service.test.sayHi('lc')
    // console.log('did ready res', res)
    // console.log('final middleware', this.app.middleware)
  }
}
