import {
  ShopStatus
} from './shop.enum'

export interface ShopQuery {
  _id?: number
  'extension.status'?: ShopStatus
}

export interface ShopData {
  address1?: string
  city?: string
  country?: string
  country_code?: string
  currency?: string
  country_name?: string
  created_at?: Date
  customer_email?: string
  domain?: string
  email?: string
  google_apps_domain?: string
  google_apps_login_enabled?: boolean
  latitude?: number
  longitude?: number
  money_format?: string
  money_with_currency_format?: string
  myharavan_domain?: string
  name?: string
  plan_name?: string
  display_plan_name?: string
  password_enabled?: boolean
  phone?: string
  province?: string
  province_code?: string
  public?: string
  shop_owner?: string
  tax_shipping?: boolean
  taxes_included?: boolean
  county_taxes?: boolean
  timezone?: string
  zip?: number
  source?: string
  has_storefront?: boolean
  shop_plan_id?: number
  inventory_method?: string
  fullname_checkout_behavior?: string
  email_checkout_behavior?: string
  phone_checkout_behavior?: string
  address_checkout_behavior?: string
  district_checkout_behavior?: string
  ward_checkout_behavior?: string
  extension?: {
    haravan_authorization_v2?: {
      id_token: string
      access_token: string
      expires_at: number
      token_type: string
      scope: string
      session_state: string
    }
  }
  doc_created_at?: Date
  doc_updated_at?: Date
}

export interface AppWebhookData {
  org_id?: string | number
  app_id?: number
  client_id?: string
  event_type?: string
  user_id?: number
  is_salechannel?: boolean
  is_marketing?: boolean
}