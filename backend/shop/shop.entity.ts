import {
  Prop,
  Schema
} from '@nestjs/mongoose'
import {
  Document
} from 'mongoose'
import {
  ShopStatus
} from './shop.enum'

@Schema()
export class ShopEntity extends Document {
  @Prop()
  _id!: number

  @Prop()
  address1!: string

  @Prop()
  city!: string

  @Prop()
  country!: string

  @Prop()
  country_code!: string

  @Prop()
  currency!: string

  @Prop()
  country_name!: string

  @Prop()
  created_at!: Date

  @Prop()
  customer_email!: string

  @Prop()
  domain!: string

  @Prop()
  email!: string

  @Prop()
  google_apps_domain!: string

  @Prop()
  google_apps_login_enabled!: boolean

  @Prop()
  latitude!: number

  @Prop()
  longitude!: number

  @Prop()
  money_format!: string

  @Prop()
  money_with_currency_format!: string

  @Prop()
  myharavan_domain!: string

  @Prop()
  name!: string

  @Prop()
  plan_name!: string

  @Prop()
  display_plan_name!: string

  @Prop()
  password_enabled!: boolean

  @Prop()
  phone!: string

  @Prop()
  province!: string

  @Prop()
  public!: string

  @Prop()
  province_code!: string

  @Prop()
  shop_owner!: string

  @Prop()
  tax_shipping!: boolean

  @Prop()
  taxes_included!: boolean

  @Prop()
  timezone!: string

  @Prop()
  zip!: number

  @Prop()
  source!: string

  @Prop()
  has_storefront!: boolean

  @Prop()
  shop_plan_id!: number

  @Prop()
  inventory_method!: string

  @Prop()
  fullname_checkout_behavior!: string

  @Prop()
  email_checkout_behavior!: string

  @Prop()
  phone_checkout_behavior!: string

  @Prop()
  address_checkout_behavior!: string

  @Prop()
  district_checkout_behavior!: string

  @Prop()
  ward_checkout_behavior!: string

  @Prop()
  extension!: {
    haravan_authorization_v2?: {
      id_token: string
      access_token: string
      expires_at: Date
      token_type: string
      scope: string
      session_state: string
    },

    status?: ShopStatus

    show_menu?: string[]
  }

  @Prop()
  doc_created_at!: Date

  @Prop()
  doc_updated_at!: Date
}
