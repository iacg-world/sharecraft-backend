/* eslint-disable @typescript-eslint/no-var-requires */
const OSS = require('ali-oss')
const path = require('path')
const dotenv = require('dotenv')
const fs = require('fs')
const { pathJoin } = require('./utils')


// 设置环境变量
dotenv.config({ path: path.resolve(__dirname, '../.env') })
const publicPath = path.resolve(__dirname, '../app/public')

// 新建一个实例
const client = new OSS({
  accessKeyId: process.env.ALC_ACCESS_KEY || '',
  accessKeySecret: process.env.ALC_SECRET_KEY || '',
  bucket: 'sharecraft-backend',
  endpoint: 'oss-accelerate.aliyuncs.com',
  secure: true,
})

async function run() {
  // 从文件夹获取对应的文件列表
  const publicFiles = fs.readdirSync(publicPath)
  const files = publicFiles.filter(f => f !== 'page.nj')
  const res = await Promise.all(
    files.map(async fileName => {
      const savedOSSPath = pathJoin('h5-assets', fileName)
      const filePath = path.join(publicPath, fileName)
      const result = await client.put(savedOSSPath, filePath)
      const { url } = result
      return url
    }),
  )
  console.log('上传成功', res)
}

run()
