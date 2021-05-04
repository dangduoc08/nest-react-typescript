import {
  Schema
} from 'mongoose'
import {
  ShopStatus
} from './shop.enum'

export const ShopSchema = new Schema(
  {
    _id: {
      type: Number,
      required: true
    },
    address1: {
      type: String
    },
    city: {
      type: String
    },
    country: {
      type: String
    },
    country_code: {
      type: String
    },
    currency: {
      type: String
    },
    country_name: {
      type: String
    },
    created_at: {
      type: Date
    },
    customer_email: {
      type: String
    },
    domain: {
      type: String
    },
    email: {
      type: String
    },
    google_apps_domain: {
      type: String
    },
    google_apps_login_enabled: {
      type: Boolean
    },
    latitude: {
      type: Number
    },
    longitude: {
      type: Number
    },
    money_format: {
      type: String
    },
    money_with_currency_format: {
      type: String
    },
    myharavan_domain: {
      type: String
    },
    name: {
      type: String
    },
    plan_name: {
      type: String
    },
    display_plan_name: {
      type: String
    },
    password_enabled: {
      type: Boolean
    },
    phone: {
      type: String
    },
    province: {
      type: String
    },
    province_code: {
      type: String
    },
    shop_owner: {
      type: String
    },
    public: {
      type: String
    },
    tax_shipping: {
      type: Boolean
    },
    taxes_included: {
      type: Boolean
    },
    county_taxes: {
      type: Boolean
    },
    timezone: {
      type: String
    },
    zip: {
      type: Number
    },
    source: {
      type: String
    },
    has_storefront: {
      type: Boolean
    },
    shop_plan_id: {
      type: Number
    },
    inventory_method: {
      type: String
    },
    fullname_checkout_behavior: {
      type: String
    },
    email_checkout_behavior: {
      type: String
    },
    phone_checkout_behavior: {
      type: String
    },
    address_checkout_behavior: {
      type: String
    },
    district_checkout_behavior: {
      type: String
    },
    ward_checkout_behavior: {
      type: String
    },
    extension: {
      status: {
        type: ShopStatus,
        default: ShopStatus.Active
      },
      haravan_authorization_v2: {
        id_token: {
          type: String
        },
        access_token: {
          type: String
        },
        expires_at: {
          type: Date
        },
        token_type: {
          type: String
        },
        scope: {
          type: String
        },
        session_state: {
          type: String
        }
      },
      show_menu: [{
        type: String
      }]
    }
  },
  {
    timestamps: {
      createdAt: 'doc_created_at',
      updatedAt: 'doc_updated_at'
    }
  }
)
