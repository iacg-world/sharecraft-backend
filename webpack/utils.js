/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')

const platform = process.platform

const pathJoin = (dirName, fileName) => {
  if (platform === 'win32') {
    return `/${dirName}/${fileName}`
  } else {
    return path.join(dirName, fileName)
  }
}

module.exports = {
  pathJoin,
}
