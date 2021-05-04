import {
  Prop,
  Schema
} from '@nestjs/mongoose'
import {
  Document
} from 'mongoose'
import {
  UserStatus
} from './user.enum'

@Schema()
export class UserEntity extends Document {
  @Prop()
  _id!: number

  @Prop()
  org_id!: number

  @Prop()
  bio!: string

  @Prop()
  email!: string

  @Prop()
  first_name!: string

  @Prop()
  last_name!: string

  @Prop()
  phone!: string

  @Prop()
  account_owner!: boolean

  @Prop()
  user_type!: string

  @Prop()
  receive_announcements!: number

  @Prop()
  url!: string

  @Prop()
  im!: string

  @Prop()
  permissions!: string[]

  @Prop()
  extension!: {
    status?: UserStatus
  }

  @Prop()
  doc_created_at!: Date

  @Prop()
  doc_updated_at!: Date
}
