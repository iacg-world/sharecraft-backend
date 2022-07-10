import { EggAppConfig, PowerPartial } from 'egg'

export default () => {
  const config: PowerPartial<EggAppConfig> = {}
  config.baseUrl = 'prod.url'
  config.mongoose = {
    url: 'mongodb://craft-mongo:27017/sharecraft',
  }
  return config
}
