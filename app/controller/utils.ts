import { Controller } from 'egg'
// import * as sharp from 'sharp'
import { nanoid } from 'nanoid'
import { createWriteStream, createReadStream } from 'node:fs'
import { parse, join, extname } from 'node:path'
import { pipeline } from 'stream/promises'
import * as sendToWormhole from 'stream-wormhole'
import * as Busboy from 'busboy'
import { FileStream } from '../../typings/app'

import { createSSRApp } from 'vue'
import { renderToString, renderToNodeStream } from '@vue/server-renderer'
export default class UtilsController extends Controller {
  pathToURL(path: string) {
    const { app } = this
    return path.replace(app.config.baseDir, app.config.baseUrl)
  }

  async uploadToOSS() {
    const { ctx, app } = this
    const stream = await ctx.getFileStream()
    const savedOSSPath = join('iacg-test', nanoid(6) + extname(stream.filename))
    try {
      const result = await ctx.oss.put(savedOSSPath, stream)
      app.logger.info(result)
      const { name, url } = result
      ctx.helper.success({ ctx, res: { name, url } })
    } catch (e) {
      await sendToWormhole(stream)
      ctx.helper.error({ ctx, errorType: 'imageUploadFail' })
    }
    // get stream saved to local file
    // file upload to OSS
    // delete local file

    // get stream upload to OSS
  }
  uploadFileUseBusBoy() {
    const { ctx, app } = this
    return new Promise<string[]>(resolve => {
      const busboy = new Busboy({ headers: ctx.req.headers as any })
      const results: string[] = []
      busboy.on('file', (fieldname, file, filename) => {
        app.logger.info(fieldname, file, filename)
        const uid = nanoid(6)
        const savedFilePath = join(
          app.config.baseDir,
          'uploads',
          uid + extname(filename),
        )
        file.pipe(createWriteStream(savedFilePath))
        file.on('end', () => {
          results.push(savedFilePath)
        })
      })
      busboy.on('field', (fieldname, val) => {
        app.logger.info(fieldname, val)
      })
      busboy.on('finish', () => {
        app.logger.info('finished')
        resolve(results)
      })
      ctx.req.pipe(busboy)
    })
  }
  async testBusBoy() {
    const { ctx, app } = this
    const results = await this.uploadFileUseBusBoy()
    ctx.helper.success({ ctx, res: results })
  }
  async uploadMultipleFiles() {
    const { ctx, app } = this
    const { fileSize } = app.config.multipart
    const parts = ctx.multipart({ limits: { fileSize: fileSize as number } })
    // { urls: [xxx, xxx ]}
    const urls: string[] = []
    let part: FileStream | string[]
    while ((part = await parts())) {
      if (Array.isArray(part)) {
        app.logger.info(part)
      } else {
        try {
          const savedOSSPath = join(
            'sharecraft-test',
            nanoid(6) + extname(part.filename),
          )
          const result = await ctx.oss.put(savedOSSPath, part)
          const { url } = result
          urls.push(url.replace('sharecraft-backend.oss-accelerate.aliyuncs.com', 'oss.lc404.cn'))
          if (part.truncated) {
            await ctx.oss.delete(savedOSSPath)
            return ctx.helper.error({
              ctx,
              errorType: 'imageUploadFileSizeError',
              error: `Reach fileSize limit ${fileSize} bytes`,
            })
          }
        } catch (e) {
          await sendToWormhole(part)
          ctx.helper.error({ ctx, errorType: 'imageUploadFail' })
        }
      }
    }
    ctx.helper.success({ ctx, res: { urls } })
  }

  splitIdAndUuid(str = '') {
    const result = { id: -1, uuid: '' }
    if (!str) return result
    const firstDashIndex = str.indexOf('-')
    if (firstDashIndex < 0) return result
    result.id = Number(str.slice(0, firstDashIndex))
    result.uuid = str.slice(firstDashIndex + 1)
    return result
  }
  async renderH5Page() {
    // id-uuid split('-')
    // uuid = aa-bb-cc
    const { ctx, app } = this
    const { idAndUuid } = ctx.params
    const query = this.splitIdAndUuid(idAndUuid)
    try {
      const pageData = await this.service.utils.renderToPageData(query)
      await ctx.render('page.nj', pageData)
    } catch (e) {
      ctx.helper.error({ ctx, errorType: 'h5WorkNotExistError' })
    }
  }
}
