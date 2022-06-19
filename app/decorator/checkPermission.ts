import { GlobalErrorTypes } from '../error'
import { Controller } from 'egg'
export default function checkPermission(
  modelName: string,
  errorType: GlobalErrorTypes,
  userKey = 'user',
) {
  return function (prototype, key: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value
    descriptor.value = async function (...args: any[]) {
      const that = this as Controller
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const { ctx } = that
      const { id } = ctx.params
      const userId = ctx.state.user._id
      const certianRecord = await ctx.model[modelName].findOne({ id })
      if (!certianRecord || certianRecord[userKey].toString() !== userId) {
        return ctx.helper.error({ ctx, errorType })
      }
      await originalMethod.apply(this, args)
    }
  }
}
