import 'egg'
import { Connection } from 'mongoose'

declare module 'egg' {
  interface Application {
    mongoose: Connection
    model: MongooseModels
  }
}
