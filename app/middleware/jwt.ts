import { Context, Application, EggAppConfig } from 'egg'
import { verify } from 'jsonwebtoken'
function getTokenValue(ctx: Context) {
  // JWT Header 格式
  // Authorization:Bearer tokenXXX
  const { authorization } = ctx.header
  // 没有这个 header 直接返回false
  if (!ctx.header || !authorization) {
    return false
  }
  if (typeof authorization === 'string') {
    const parts = authorization.trim().split(' ')
    if (parts.length === 2) {
      const scheme = parts[0]
      const credentials = parts[1]
      if (/^Bearer$/i.test(scheme)) {
        return credentials
      }
    } else {
      return false
    }
  } else {
    return false
  }
}
export default (options: EggAppConfig['jwt']) => {
  return async (ctx: Context, next: () => Promise<any>) => {
    // 从 header 获取对应的 token
    const token = getTokenValue(ctx)
    if (!token) {
      return ctx.helper.error({ ctx, errorType: 'loginValidateFail' })
    }
    // 判断 secret 是否存在
    const { secret } = options
    if (!secret) {
      throw new Error('Secret not provided')
    }
    try {
      const decoded = verify(token, secret)
      ctx.state.user = decoded
      await next()
    } catch (e) {
      return ctx.helper.error({ ctx, errorType: 'loginValidateFail' })
    }
  }
}
