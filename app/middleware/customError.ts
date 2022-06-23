import { Context } from 'egg'
export default () => {
  return async (ctx: Context, next: () => Promise<any>) => {
    try {
      await next()
    } catch (e) {
      const error = e as any
      if (error && error.status === 401) {
        return ctx.helper.error({ ctx, errorType: 'loginValidateFail' })
      } else if (ctx.path === '/api/utils/upload-img') {
        if (error && error.status === 400) {
          return ctx.helper.error({
            ctx,
            errorType: 'imageUploadFileFormatError',
            error: error.message,
          })
        }
        throw error
      }
      throw error
    }
  }
}
