import {
  IsNotEmpty
} from 'class-validator'

export abstract class SubscribeWebhookDto {
  abstract 'hub.mode': string
  abstract 'hub.verify_token': string
  abstract 'hub.challenge': string
}

export abstract class WebhookHeaderDto {
  @IsNotEmpty()
  abstract 'x-haravan-topic': string

  abstract 'x-haravan-org-id': string
  abstract 'x-haravan-hmacsha256': string
}

export abstract class AppWebhookBodyDto {
  abstract org_id: string | number
  abstract app_id: number
  abstract client_id: string
  abstract event_type: string
  abstract user_id: number
  abstract is_salechannel: boolean
  abstract is_marketing: boolean
}

export abstract class ShopWebhookBodyDto {
  abstract id: number
  abstract address1: string
  abstract city: string
  abstract country: string
  abstract country_code: string
  abstract currency: string
  abstract country_name: string
  abstract created_at: Date
  abstract customer_email: string
  abstract domain: string
  abstract email: string
  abstract google_apps_domain: string
  abstract google_apps_login_enabled: boolean
  abstract latitude: number
  abstract longitude: number
  abstract money_format: string
  abstract money_with_currency_format: string
  abstract myharavan_domain: string
  abstract name: string
  abstract plan_name: string
  abstract display_plan_name: string
  abstract password_enabled: boolean
  abstract phone: string
  abstract province: string
  abstract province_code: string
  abstract public: string
  abstract shop_owner: string
  abstract tax_shipping: boolean
  abstract taxes_included: boolean
  abstract county_taxes: boolean
  abstract timezone: string
  abstract zip: number
  abstract source: string
  abstract has_storefront: boolean
  abstract shop_plan_id: number
  abstract inventory_method: string
  abstract fullname_checkout_behavior: string
  abstract email_checkout_behavior: string
  abstract phone_checkout_behavior: string
  abstract address_checkout_behavior: string
  abstract district_checkout_behavior: string
  abstract ward_checkout_behavior: string
}

export abstract class UserWebhookBodyDto {
  abstract account_owner: boolean
  abstract bio: string
  abstract email: string
  abstract first_name: string
  abstract id: number
  abstract im: string
  abstract last_name: string
  abstract phone: string
  abstract user_type: string
  abstract receive_announcements: number
  abstract permissions: string[]
}
