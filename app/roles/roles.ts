import { Ability, AbilityBuilder } from '@casl/ability'
import { Document } from 'mongoose'
import { UserProps } from '../model/user'

export default function defineRoles(
  user: UserProps & Document<any, any, UserProps>,
) {
  const { can, build } = new AbilityBuilder(Ability)
  if (user) {
    if (user.role === 'admin') {
      can('manage', 'all')
    } else {
      // normal login user
      // users, 只能读取自己的信息，以及更新特殊的字段
      can('read', 'User', { _id: user._id })
      can('update', 'User', ['nickName', 'picture'], { _id: user._id })
      // works, 可以创建，然后可以更新和删除自己的 Work
      can('create', 'Work', ['title', 'desc', 'content', 'coverImg'])
      can('read', 'Work', { user: user._id })
      can('update', 'Work', ['title', 'desc', 'content', 'coverImg'], {
        user: user._id,
      })
      can('delete', 'Work', { user: user._id })
      // channels, 创建，更新和删除属于自己的 channel
      can('create', 'Channel', ['name', 'workId'], { user: user._id })
      can('read', 'Channel', { user: user._id })
      can('update', 'Channel', ['name'], { user: user._id })
      can('delete', 'Channel', ['name'], { user: user._id })
    }
  }
  return build()
}
