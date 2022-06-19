import { Controller } from 'egg'
import * as sharp from 'sharp'
import { nanoid } from 'nanoid'
import { createWriteStream, createReadStream } from 'fs'
import { parse, join, extname } from 'path'
import { pipeline } from 'stream/promises'
export default class UtilsController extends Controller {
  async fileLocalUpload() {
    const { ctx, app } = this
    const { filepath } = ctx.request.files[0]
    // 生成 sharp 实例
    const imageSource = sharp(filepath)
    const metaData = await imageSource.metadata()
    app.logger.debug(metaData)
    let thumbnailUrl = ''
    // 检查图片宽度是否大于 300
    if (metaData.width && metaData.width > 300) {
      // generate a new file path
      // /uploads/**/abc.png =》 /uploads/**/abc-thumbnail.png
      const { name, ext, dir } = parse(filepath)
      app.logger.debug(name, ext, dir)
      const thumbnailFilePath = join(dir, `${name}-thumbnail${ext}`)
      await imageSource.resize({ width: 300 }).toFile(thumbnailFilePath)
      thumbnailUrl = thumbnailFilePath.replace(
        app.config.baseDir,
        app.config.baseUrl,
      )
    }
    const url = filepath.replace(app.config.baseDir, app.config.baseUrl)
    ctx.helper.success({
      ctx,
      res: { url, thumbnailUrl: thumbnailUrl ? thumbnailUrl : url },
    })
  }
  pathToURL(path: string) {
    const { app } = this
    return path.replace(app.config.baseDir, app.config.baseUrl)
  }

  async fileUploadByStream() {
    const { ctx, app } = this
    const stream = await this.ctx.getFileStream()
    // uploads/***.ext
    // uploads/xxx_thumbnail.ext
    const uid = nanoid(6)
    const savedFilePath = join(
      app.config.baseDir,
      'uploads',
      uid + extname(stream.filename),
    )
    const savedThumbnailPath = join(
      app.config.baseDir,
      'uploads',
      uid + '_thumbnail' + extname(stream.filename),
    )
    const target = createWriteStream(savedFilePath)
    const target2 = createWriteStream(savedThumbnailPath)
    const savePromise = pipeline(stream, target)
    const transformer = sharp().resize({ width: 300 })
    const thumbnailPromise = pipeline(stream, transformer, target2)
    try {
      await Promise.all([savePromise, thumbnailPromise])
    } catch (e) {
      return ctx.helper.error({ ctx, errorType: 'imageUploadFail' })
    }
    ctx.helper.success({
      ctx,
      res: {
        url: this.pathToURL(savedFilePath),
        thumbnailUrl: this.pathToURL(savedThumbnailPath),
      },
    })
  }
}
