import {
  Prop,
  Schema
} from '@nestjs/mongoose'
import {
  Document
} from 'mongoose'

@Schema()
export class SessionEntity extends Document {
  @Prop()
  session!: {
    org_id: number
    org_name: string
    user_id: number
    sid: string
    access_token: string
    expires_at: Date
    role: string[]
    user_extension?: {
      first_name?: string
      last_name?: string
    }
    shop_extension?: {
      name?: string
      myharavan_domain?: string
    }
    extension?: {
      haravan_access_token_v2?: string
      app_permissions?: string[]
    }
  }
}
