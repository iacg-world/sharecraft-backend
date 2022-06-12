import { Application } from 'egg'
import { Schema } from 'mongoose'

export interface UserProps {
  username: string
  password: string
  email?: string
  nickName?: string
  picture?: string
  phoneNumber?: string
  createdAt: Date
  updatedAt: Date
}

function initUserModel(app: Application) {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema
  const UserSchema = new Schema<UserProps>(
    {
      username: { type: String, unique: true, required: true },
      password: { type: String, required: true },
      nickName: { type: String },
      picture: { type: String },
      email: { type: String },
      phoneNumber: { type: String },
    },
    { timestamps: true },
  )
  return app.mongoose.model<UserProps>('User', UserSchema)
}

export default initUserModel
