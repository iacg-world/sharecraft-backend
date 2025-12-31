import { EggAppConfig, PowerPartial } from 'egg'

export default () => {
  const config: PowerPartial<EggAppConfig> = {}
  config.baseUrl = 'prod.url'
  config.mongoose = {
    url: 'mongodb://craft-mongo:27017/craft',
    options: {
      user: process.env.MONGO_DB_USERNAME,
      pass: process.env.MONGO_DB_PASSWORD,
    },
  }
  config.redis = {
    client: {
      port: 6379,
      host: 'craft-redis',
      password: process.env.REDIS_PASSWORD,
      db: 0,
    },
  }
  return config
}
