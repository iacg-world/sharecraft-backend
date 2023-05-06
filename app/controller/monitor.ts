

import { Controller } from 'egg'
import { execSync } from 'child_process'
import path = require('path')

const PYTHON_CONNECT_SCRIPT_PATH = path.resolve(__dirname, '../../monitor/connect.py')

// format: 20220326
function createDatetime() {
  const date = new Date()
  const year = date.getFullYear()
  let month:any = date.getMonth() + 1
  let day:any = date.getDate()
  if (month < 10) {
    month = '0' + month
  }
  if (day < 10) {
    day = '0' + day
  }
  return year + month + day
}

export default class MonitorController extends Controller {
  async upload() {
    const { ctx } = this
    console.log(ctx.query)
    if (ctx.query) {
      const appId = ctx.query.appId
      const pageId = ctx.query.pageId
      const timestamp = ctx.query.timestamp
      const ua = ctx.query.ua
      const url = ctx.query.url
      const eventType = ctx.query.eventType
      const userId = ctx.query.user_id
      const visitorId = ctx.query.visitor_id
      const modId = ctx.query.modId || ''
      let args = ctx.query.args || {}
      if (Object.keys(args).length === 0) {
        args = '{}'
      } else {
        args = JSON.stringify(args)
      }

      if (appId && pageId && timestamp && ua && url && eventType) {
        // 1:appid
        // 2:pageid
        // 3:timestamp
        // 4:ua
        // 5:url
        // 6:args
        // 7:eventtype
        // 8:userId
        // 9:visitorId
        // 10:modId
        const datetime = createDatetime()
        let sql = `INSERT INTO iacg.iacg_monitor PARTITION (datetime = "${datetime}") VALUES (`
        sql = `${sql}"${appId}",`
        sql = `${sql}"${pageId}",`
        sql = `${sql}"${timestamp}",`
        sql = `${sql}"${ua}",`
        sql = `${sql}"${url}",`
        sql = `${sql}${args},`
        sql = `${sql}"${eventType}",`
        sql = `${sql}"${userId}",`
        sql = `${sql}"${visitorId}",`
        sql = `${sql}"${modId}"`
        sql = `${sql})`
        console.log(sql)
        const ret = execSync('python ' + PYTHON_CONNECT_SCRIPT_PATH + ' "' + encodeURIComponent(sql) + '"') // Buffer
        console.log(ret.toString())

        ctx.body = {
          appId,
          pageId,
          timestamp,
          ua,
          url,
          eventType,
        }
      } else {
        ctx.body = {
          code: -1,
          msg: '上传参数不全，请补充',
        }
      }
    } else {
      ctx.body = {
        code: -1,
        msg: 'upload failed',
      }
    }
  }

}
