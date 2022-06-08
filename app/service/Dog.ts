import { Service } from 'egg'
interface DogResp {
  message: string
  status: string
}
export default class DogService extends Service {
  async show() {
    const resp = await this.ctx.curl<DogResp>(
      'https://dog.ceo/api/breeds/image/random',
      {
        dataType: 'json',
      },
    )
    return resp.data
  }

  async showPlayers() {
    const result = await this.app.model.User.find({ age: { $gt: 18 } }).exec()
    return result
  }
}
