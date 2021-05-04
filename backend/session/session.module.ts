import {
  Module,
  Global
} from '@nestjs/common'
import {
  SessionService
} from './session.service'
import {
  SessionSchema
} from './session.schema'
import {
  SESSION_MODEL
} from './session.constant'
import {
  MongooseModule
} from '../mongoose'

@Global()
@Module({
  imports: [
    MongooseModule.useSchema([
      { name: SESSION_MODEL, schema: SessionSchema }
    ])
  ],
  providers: [
    SessionService
  ],
  exports: [
    SessionService
  ]
})
export class SessionModule { }
