import { EggAppConfig, PowerPartial } from 'egg'

export default () => {
  const config: PowerPartial<EggAppConfig> = {}
  config.baseUrl = `http://${process.env.DEV_HOST}:7001`

  config.mongoose = {
    url: `mongodb://${process.env.DEV_HOST}:27016/craft`,
    options: {
      user: process.env.MONGO_DB_USERNAME,
      pass: process.env.MONGO_DB_PASSWORD,
    },
  }
  config.redis = {
    client: {
      port: 6377,
      host: process.env.DEV_HOST || '127.0.0.1',
      password: process.env.REDIS_PASSWORD,
      db: 0,
    },
  }
  return config
}
