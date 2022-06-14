import { Controller } from 'egg'
const workCreateRules = {
  title: 'string',
}
export const workErrorMessages = {
  workValidateFail: {
    errno: 102001,
    message: '输入信息验证失败',
  },
}

export default class WorkController extends Controller {
  private validateUserInput(rules: any) {
    const { ctx, app } = this
    // ctx.validate(userCreateRules)
    const errors = app.validator.validate(rules, ctx.request.body)
    ctx.logger.warn(errors)
    return errors
  }
  async createWork() {
    const { ctx, service } = this
    const errors = this.validateUserInput(workCreateRules)
    if (errors) {
      return ctx.helper.error({
        ctx,
        errorType: 'workValidateFail',
        error: errors,
      })
    }
    const workData = await service.work.createEmptyWork(ctx.request.body)
    ctx.helper.success({ ctx, res: workData })
  }
}
