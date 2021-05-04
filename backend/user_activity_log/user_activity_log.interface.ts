import {
  UserActivityLogEvent,
  UserActivityLogResult
} from './user_activity_log.enum'

export interface CreateOneData<E = unknown, O = unknown, N = unknown> {
  org_id: number
  user_id: number
  event_id: UserActivityLogEvent
  result_id: UserActivityLogResult
  first_name?: string
  last_name?: string
  extension?: E
  old_value?: O
  new_value?: N
}