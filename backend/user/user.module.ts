import {
  Module
} from '@nestjs/common'
import {
  UserService
} from './user.service'
import {
  UserSchema
} from './user.schema'
import {
  USER_MODEL
} from './user.constant'
import {
  UserController
} from './user.controller'
import {
  MongooseModule
} from '../mongoose'

@Module({
  imports: [
    MongooseModule.useSchema([
      { name: USER_MODEL, schema: UserSchema }
    ])
  ],
  providers: [
    UserService
  ],
  exports: [
    UserService
  ],
  controllers: [
    UserController
  ]
})
export class UserModule { }
