import { EggPlugin } from 'egg'

const plugin: EggPlugin = {
  // static: true,
  nunjucks: {
    enable: true,
    package: 'egg-view-nunjucks',
  },
  mongoose: {
    enable: true,
    package: 'egg-mongoose',
  },
  validate: {
    enable: true,
    package: 'egg-validate',
  },
  bcrypt: {
    enable: true,
    package: 'egg-bcrypt',
  },
  jwt: {
    enable: false,
    package: 'egg-jwt',
  },
  redis: {
    enable: true,
    package: 'egg-redis',
  },
  cors: {
    enable: true,
    package: 'egg-cors',
  },
  oss: {
    enable: true,
    package: 'egg-oss',
  },
}

export default plugin
