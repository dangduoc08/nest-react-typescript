import {
  Prop,
  Schema
} from '@nestjs/mongoose'
import {
  Document
} from 'mongoose'
import {
  UserActivityLogEvent,
  UserActivityLogResult
} from './user_activity_log.enum'

@Schema()
export class UserActivityLogEntity extends Document {
  @Prop()
  first_name!: string

  @Prop()
  last_name!: string

  @Prop()
  org_id!: number

  @Prop()
  event_id!: UserActivityLogEvent

  @Prop()
  result_id!: UserActivityLogResult

  @Prop()
  user_id!: number

  @Prop()
  extension!: unknown

  @Prop()
  old_value!: unknown

  @Prop()
  new_value!: unknown
}
