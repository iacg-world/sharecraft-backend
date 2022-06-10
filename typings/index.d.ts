import 'egg'
import { Connection } from 'mongoose'

declare module 'egg' {
  interface MongooseModels extends IModel {
    [key: string]: Model<any>
  }
}
