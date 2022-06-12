import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg'

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1654329281466_8642'

  // add your egg config in here
  config.middleware = []
  config.mongoose = {
    url: 'mongodb://localhost:27017/sharecraft',
  }
  config.bcrypt = {
    saltRounds: 10,
  }
  config.session = {
    encrypt: true,
  }
  // add your special config in here
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
    myLogger: {
      allowedMethod: ['POST'],
    },
    baseUrl: 'default.url',
  }

  config.middleware = []
  config.security = {
    csrf: {
      enable: false,
    },
  }
  config.logger = {
    consoleLevel: 'DEBUG',
  }

  config.view = {
    defaultViewEngine: 'nunjucks',
  }

  // the return config will combines to EggAppConfig
  return {
    ...(config as object),
    ...bizConfig,
  }
}
