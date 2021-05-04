import {
  UserStatus
} from './user.enum'

export interface UserQuery {
  _id?: number
  'extension.status'?: UserStatus
}

export interface UserData {
  org_id?: number
  email?: string
  first_name?: string
  last_name?: string
  phone?: string
  account_owner?: boolean
  user_type?: string
  receive_announcements?: number
  url?: string
  im?: string
  permissions?: string[]
  bio?: string
}

export interface UserPayload {
  id?: number
  account_owner?: boolean
  bio?: string
  email?: string
  first_name?: string
  im?: string
  last_name?: string
  phone?: string
  user_type?: string
  receive_announcements?: number
  permissions?: string[]
}