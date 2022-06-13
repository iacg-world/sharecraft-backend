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
    enable: true,
    package: 'egg-jwt',
  },
}

export default plugin
