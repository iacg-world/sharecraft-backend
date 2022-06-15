import { userErrorMessages } from './user'
import { workErrorMessages } from './work'

export type GlobalErrorTypes = keyof (typeof userErrorMessages &
  typeof workErrorMessages)
export const globalErrorMessages = {
  ...userErrorMessages,
  ...workErrorMessages,
}
