import { EggAppConfig, PowerPartial } from 'egg'

export default () => {
  const config: PowerPartial<EggAppConfig> = {}
  config.baseUrl = 'http://localhost:7001'
  return config
}
