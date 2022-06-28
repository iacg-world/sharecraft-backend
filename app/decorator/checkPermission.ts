import { GlobalErrorTypes } from '../error'
import defineRoles from '../roles/roles'
import { Controller } from 'egg'
import { subject } from '@casl/ability'
import { permittedFieldsOf } from '@casl/ability/extra'
import { difference } from 'lodash'

const caslMethodMapping: Record<string, string> = {
  GET: 'read',
  POST: 'create',
  PATCH: 'update',
  DELETE: 'delete',
}
interface ModelMapping {
  mongoose: string
  casl: string
}
interface IOptions {
  // 自定义 action
  action?: string
  // 查找记录时候的 key，默认为 id
  key?: string
  // 查找记录时候 value 的 来源 默认为 ctx.params
  // 来源于对应的 URL 参数 或者 ctx.request.body, valueKey 数据来源的键值
  value?: { type: 'params' | 'body'; valueKey: string }
}
const fieldsOptions = { fieldsFrom: rule => rule.fields || [] }

// { id: ctx.params.id }
// { 'channels.id' : ctx.params.id }
// { 'channels.id' : ctx.request.body.workID }
export default function checkPermission(
  modelName: string,
  errorType: GlobalErrorTypes,
  options?: IOptions,
) {
  return function (prototype, key: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value
    descriptor.value = async function (...args: any[]) {
      const that = this as Controller
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const { ctx } = that
      const { id } = ctx.params
      const { method } = ctx.request
      const action =
        options && options.action ? options.action : caslMethodMapping[method]
      console.log(action)
      if (!ctx.state && !ctx.state.user) {
        return ctx.helper.error({ ctx, errorType })
      }
      let permission = false
      let keyPermission = true
      // 获取定义的 roles
      const ability = defineRoles(ctx.state.user)
      // 所以我们需要先获取 rule 来判断一下，看他是否存在对应的条件
      const rule = ability.relevantRuleFor(action, modelName)
      if (rule && rule.conditions) {
        // 假如存在 condition，先查询对应的数据
        const certianRecord = await ctx.model[modelName].findOne({ id }).lean()
        permission = ability.can(action, subject(modelName, certianRecord))
      } else {
        permission = ability.can(action, modelName)
      }
      // 判断 rule 中是否有对应的受限字段
      if (rule && rule.fields) {
        const fields = permittedFieldsOf(
          ability,
          action,
          modelName,
          fieldsOptions,
        )
        if (fields.length > 0) {
          // 1 过滤 request.body *
          // 2 获取当前 payload 的 keys 和 允许的 fields 做比较
          // fields 对 payloadKeys 的关系应该是全部包含的关系
          const payloadKeys = Object.keys(ctx.request.body)
          const diffKeys = difference(payloadKeys, fields)
          console.log('diffKeys', diffKeys)
          keyPermission = diffKeys.length === 0
        }
      }
      if (!permission || !keyPermission) {
        return ctx.helper.error({ ctx, errorType })
      }
      await originalMethod.apply(this, args)
    }
  }
}
