import { Context, Application, EggAppConfig } from 'egg'
import { appendFileSync } from 'node:fs'
export default (options: EggAppConfig['myLogger'], app: Application) => {
  return async (ctx: Context, next: () => Promise<any>) => {
    // console.log('options', options)
    // console.log('default options', app.config.logger)
    const startTime = Date.now()
    const requestTime = new Date()
    await next()
    const ms = Date.now() - startTime
    const logTime = `${requestTime} -- ${ctx.method} -- ${ctx.url} -- ${ms}ms`
    if (options.allowedMethod.includes(ctx.method)) {
      appendFileSync('./log.txt', logTime + '\n')
    }
  }
}
