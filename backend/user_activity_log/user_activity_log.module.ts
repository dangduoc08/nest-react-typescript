import {
  Module
} from '@nestjs/common'
import {
  UserActivityLogService
} from './user_activity_log.service'
import {
  UserActivityLogSchema
} from './user_activity_log.schema'
import {
  USER_ACTIVITY_LOG_MODEL
} from './user_activity_log.constant'
import {
  MongooseModule
} from '../mongoose'

@Module({
  imports: [
    MongooseModule.useSchema([
      { name: USER_ACTIVITY_LOG_MODEL, schema: UserActivityLogSchema }
    ])
  ],
  providers: [
    UserActivityLogService
  ],
  exports: [
    UserActivityLogService
  ]
})
export class UserActivityLogModule { }
