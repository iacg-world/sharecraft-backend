import { IBoot, Application } from 'egg'
import { createConnection } from 'mongoose'
import * as assert from 'assert'
import { join } from 'path'
export default class AppBoot implements IBoot {
  private readonly app: Application
  constructor(app: Application) {
    this.app = app
    // 启用内存储存
    // app.sessionMap = {}
    // app.sessionStore = {
    //   async get(key) {
    //     app.logger.info('key', key)
    //     return app.sessionMap[key]
    //   },
    //   async set(key, value) {
    //     app.logger.info('key', key)
    //     app.logger.info('value', value)
    //     app.sessionMap[key] = value
    //   },
    //   async destroy(key) {
    //     delete app.sessionMap[key]
    //   },
    // }

  }
  configWillLoad() {
    // 此时 config 文件已经被读取并合并，但是还并未生效
    // 这是应用层修改配置的最后时机
    // console.log('config', this.app.config.baseUrl)
    // console.log('enable middleware', this.app.config.coreMiddleware)
    this.app.config.coreMiddleware.push('customError')
  }
  async willReady() {
    // console.log('enable willready', this.app.config.coreMiddleware)
    // const dir = join(this.app.config.baseDir, 'app/model')
    // this.app.loader.loadToApp(dir, 'model', {
    //   caseStyle: 'upper',
    // })
  }
  async didReady() {
    // const ctx = await this.app.createAnonymousContext()
    // const res = await ctx.service.test.sayHi('lc')
    // console.log('did ready res', res)
    console.log('final middleware', this.app.middleware)
  }
}
