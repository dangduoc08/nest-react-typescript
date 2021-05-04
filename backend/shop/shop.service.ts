import {
  Injectable,
  Inject
} from '@nestjs/common'
import {
  Model
} from 'mongoose'
import {
  ShopQuery,
  ShopData
} from './shop.interface'
import {
  ShopEntity
} from './shop.entity'
import {
  SHOP_MODEL
} from './shop.constant'
import {
  ShopStatus
} from './shop.enum'

@Injectable({})
export class ShopService {
  constructor(
    @Inject(SHOP_MODEL) readonly ShopModel: Model<ShopEntity>
  ) { }
  public async getOne(
    shopQuery: ShopQuery
  ): Promise<ShopEntity | null> {
    const queryData: Record<string, unknown> = {}

    if (shopQuery._id !== undefined) {
      queryData['_id'] = +shopQuery?._id
    }

    if (shopQuery['extension.status'] !== undefined) {
      queryData['extension.status'] = +shopQuery['extension.status']
    }

    return await this.ShopModel.findOne(
      {
        ...queryData
      }
    )
  }

  public async upsertOne(
    shopQuery: ShopQuery,
    shopData: ShopData
  ): Promise<ShopEntity | null> {
    const queryData: Record<string, unknown> = {}

    if (shopQuery._id !== undefined) {
      queryData['_id'] = +shopQuery?._id
    }

    if (shopQuery['extension.status'] !== undefined) {
      queryData['extension.status'] = +shopQuery['extension.status']
    }

    const updateData = {
      'extension.status': ShopStatus.Active
    }

    if (shopData.address1 !== undefined) {
      updateData['address1'] = shopData?.address1?.trim()
    }

    if (shopData.city !== undefined) {
      updateData['city'] = shopData?.city?.trim()
    }

    if (shopData.country_code !== undefined) {
      updateData['country_code'] = shopData?.country_code?.trim()
    }

    if (shopData.currency !== undefined) {
      updateData['currency'] = shopData?.currency?.trim()
    }

    if (shopData.country_name !== undefined) {
      updateData['country_name'] = shopData?.country_name?.trim()
    }

    if (shopData.created_at !== undefined) {
      updateData['created_at'] = shopData?.created_at
    }

    if (shopData.customer_email !== undefined) {
      updateData['customer_email'] = shopData?.customer_email?.trim()
    }

    if (shopData.domain !== undefined) {
      updateData['domain'] = shopData?.domain?.trim()
    }

    if (shopData.email !== undefined) {
      updateData['email'] = shopData?.email?.trim()
    }

    if (shopData.google_apps_domain !== undefined) {
      updateData['google_apps_domain'] = shopData?.google_apps_domain?.trim()
    }

    if (shopData.google_apps_login_enabled !== undefined) {
      updateData['google_apps_login_enabled'] = shopData?.google_apps_login_enabled
    }

    if (shopData.latitude !== undefined) {
      updateData['latitude'] = +shopData?.latitude
    }

    if (shopData.longitude !== undefined) {
      updateData['longitude'] = +shopData?.longitude
    }

    if (shopData.money_format !== undefined) {
      updateData['money_format'] = shopData?.money_format?.trim()
    }

    if (shopData.money_with_currency_format !== undefined) {
      updateData['money_with_currency_format'] = shopData?.money_with_currency_format?.trim()
    }

    if (shopData.myharavan_domain !== undefined) {
      updateData['myharavan_domain'] = shopData?.myharavan_domain?.trim()
    }

    if (shopData.name !== undefined) {
      updateData['name'] = shopData?.name?.trim()
    }

    if (shopData.plan_name !== undefined) {
      updateData['plan_name'] = shopData?.plan_name?.trim()
    }

    if (shopData.display_plan_name !== undefined) {
      updateData['display_plan_name'] = shopData?.display_plan_name?.trim()
    }

    if (shopData.password_enabled !== undefined) {
      updateData['password_enabled'] = shopData?.password_enabled
    }

    if (shopData.phone !== undefined) {
      updateData['phone'] = shopData?.phone?.trim()
    }

    if (shopData.province !== undefined) {
      updateData['province'] = shopData?.province?.trim()
    }

    if (shopData.province_code !== undefined) {
      updateData['province_code'] = shopData?.province_code?.trim()
    }

    if (shopData.public !== undefined) {
      updateData['public'] = shopData?.public?.trim()
    }

    if (shopData.shop_owner !== undefined) {
      updateData['shop_owner'] = shopData?.shop_owner?.trim()
    }

    if (shopData.tax_shipping !== undefined) {
      updateData['tax_shipping'] = shopData?.tax_shipping
    }

    if (shopData.taxes_included !== undefined) {
      updateData['taxes_included'] = shopData?.taxes_included
    }

    if (shopData.county_taxes !== undefined) {
      updateData['county_taxes'] = shopData?.county_taxes
    }

    if (shopData.timezone !== undefined) {
      updateData['timezone'] = shopData?.timezone
    }

    if (shopData.zip !== undefined) {
      updateData['zip'] = +shopData?.zip
    }

    if (shopData.source !== undefined) {
      updateData['source'] = shopData?.source?.trim()
    }

    if (shopData.has_storefront !== undefined) {
      updateData['has_storefront'] = shopData?.has_storefront
    }

    if (shopData.shop_plan_id !== undefined) {
      updateData['shop_plan_id'] = +shopData?.shop_plan_id
    }

    if (shopData.inventory_method !== undefined) {
      updateData['inventory_method'] = shopData?.inventory_method?.trim()
    }

    if (shopData.fullname_checkout_behavior !== undefined) {
      updateData['fullname_checkout_behavior'] = shopData?.fullname_checkout_behavior?.trim()
    }

    if (shopData.email_checkout_behavior !== undefined) {
      updateData['email_checkout_behavior'] = shopData?.email_checkout_behavior?.trim()
    }

    if (shopData.phone_checkout_behavior !== undefined) {
      updateData['phone_checkout_behavior'] = shopData?.phone_checkout_behavior?.trim()
    }

    if (shopData.address_checkout_behavior !== undefined) {
      updateData['address_checkout_behavior'] = shopData?.address_checkout_behavior?.trim()
    }

    if (shopData.district_checkout_behavior !== undefined) {
      updateData['district_checkout_behavior'] = shopData?.district_checkout_behavior?.trim()
    }

    if (shopData.ward_checkout_behavior !== undefined) {
      updateData['ward_checkout_behavior'] = shopData?.ward_checkout_behavior?.trim()
    }

    if (
      shopData?.extension?.haravan_authorization_v2?.access_token !== undefined
      && shopData?.extension?.haravan_authorization_v2?.token_type !== undefined
    ) {

      updateData['extension.haravan_authorization_v2'] = {
        id_token: shopData?.extension?.haravan_authorization_v2?.id_token,
        access_token: shopData?.extension?.haravan_authorization_v2?.access_token,
        token_type: shopData?.extension?.haravan_authorization_v2?.token_type.trim(),
        scope: shopData?.extension?.haravan_authorization_v2?.scope.trim(),
        session_state: shopData?.extension?.haravan_authorization_v2?.session_state
      }
      if (shopData?.extension?.haravan_authorization_v2?.expires_at) {
        updateData['extension.haravan_authorization_v2']['expires_at'] = new Date(shopData.extension.haravan_authorization_v2.expires_at * 1000)
      }
    }

    return await this.ShopModel.findOneAndUpdate(
      {
        ...queryData
      },
      {
        ...updateData
      },
      {
        upsert: true,
        new: true
      }
    )
  }

  public async updateOne(
    shopQuery: ShopQuery,
    shopData: ShopData
  ): Promise<ShopEntity | null> {
    const queryData: Record<string, unknown> = {}

    if (shopQuery._id !== undefined) {
      queryData['_id'] = +shopQuery?._id
    }

    if (shopQuery['extension.status'] !== undefined) {
      queryData['extension.status'] = +shopQuery['extension.status']
    }

    const updateData: Record<string, unknown> = {}

    if (shopData.address1 !== undefined) {
      updateData['address1'] = shopData?.address1?.trim()
    }

    if (shopData.city !== undefined) {
      updateData['city'] = shopData?.city?.trim()
    }

    if (shopData.country_code !== undefined) {
      updateData['country_code'] = shopData?.country_code?.trim()
    }

    if (shopData.currency !== undefined) {
      updateData['currency'] = shopData?.currency?.trim()
    }

    if (shopData.country_name !== undefined) {
      updateData['country_name'] = shopData?.country_name?.trim()
    }

    if (shopData.created_at !== undefined) {
      updateData['created_at'] = shopData?.created_at
    }

    if (shopData.customer_email !== undefined) {
      updateData['customer_email'] = shopData?.customer_email?.trim()
    }

    if (shopData.domain !== undefined) {
      updateData['domain'] = shopData?.domain?.trim()
    }

    if (shopData.email !== undefined) {
      updateData['email'] = shopData?.email?.trim()
    }

    if (shopData.google_apps_domain !== undefined) {
      updateData['google_apps_domain'] = shopData?.google_apps_domain?.trim()
    }

    if (shopData.google_apps_login_enabled !== undefined) {
      updateData['google_apps_login_enabled'] = shopData?.google_apps_login_enabled
    }

    if (shopData.latitude !== undefined) {
      updateData['latitude'] = +shopData?.latitude
    }

    if (shopData.longitude !== undefined) {
      updateData['longitude'] = +shopData?.longitude
    }

    if (shopData.money_format !== undefined) {
      updateData['money_format'] = shopData?.money_format?.trim()
    }

    if (shopData.money_with_currency_format !== undefined) {
      updateData['money_with_currency_format'] = shopData?.money_with_currency_format?.trim()
    }

    if (shopData.myharavan_domain !== undefined) {
      updateData['myharavan_domain'] = shopData?.myharavan_domain?.trim()
    }

    if (shopData.name !== undefined) {
      updateData['name'] = shopData?.name?.trim()
    }

    if (shopData.plan_name !== undefined) {
      updateData['plan_name'] = shopData?.plan_name?.trim()
    }

    if (shopData.display_plan_name !== undefined) {
      updateData['display_plan_name'] = shopData?.display_plan_name?.trim()
    }

    if (shopData.password_enabled !== undefined) {
      updateData['password_enabled'] = shopData?.password_enabled
    }

    if (shopData.phone !== undefined) {
      updateData['phone'] = shopData?.phone?.trim()
    }

    if (shopData.province !== undefined) {
      updateData['province'] = shopData?.province?.trim()
    }

    if (shopData.province_code !== undefined) {
      updateData['province_code'] = shopData?.province_code?.trim()
    }

    if (shopData.public !== undefined) {
      updateData['public'] = shopData?.public?.trim()
    }

    if (shopData.shop_owner !== undefined) {
      updateData['shop_owner'] = shopData?.shop_owner?.trim()
    }

    if (shopData.tax_shipping !== undefined) {
      updateData['tax_shipping'] = shopData?.tax_shipping
    }

    if (shopData.taxes_included !== undefined) {
      updateData['taxes_included'] = shopData?.taxes_included
    }

    if (shopData.county_taxes !== undefined) {
      updateData['county_taxes'] = shopData?.county_taxes
    }

    if (shopData.timezone !== undefined) {
      updateData['timezone'] = shopData?.timezone
    }

    if (shopData.zip !== undefined) {
      updateData['zip'] = +shopData?.zip
    }

    if (shopData.source !== undefined) {
      updateData['source'] = shopData?.source?.trim()
    }

    if (shopData.has_storefront !== undefined) {
      updateData['has_storefront'] = shopData?.has_storefront
    }

    if (shopData.shop_plan_id !== undefined) {
      updateData['shop_plan_id'] = +shopData?.shop_plan_id
    }

    if (shopData.inventory_method !== undefined) {
      updateData['inventory_method'] = shopData?.inventory_method?.trim()
    }

    if (shopData.fullname_checkout_behavior !== undefined) {
      updateData['fullname_checkout_behavior'] = shopData?.fullname_checkout_behavior?.trim()
    }

    if (shopData.email_checkout_behavior !== undefined) {
      updateData['email_checkout_behavior'] = shopData?.email_checkout_behavior?.trim()
    }

    if (shopData.phone_checkout_behavior !== undefined) {
      updateData['phone_checkout_behavior'] = shopData?.phone_checkout_behavior?.trim()
    }

    if (shopData.address_checkout_behavior !== undefined) {
      updateData['address_checkout_behavior'] = shopData?.address_checkout_behavior?.trim()
    }

    if (shopData.district_checkout_behavior !== undefined) {
      updateData['district_checkout_behavior'] = shopData?.district_checkout_behavior?.trim()
    }

    if (shopData.ward_checkout_behavior !== undefined) {
      updateData['ward_checkout_behavior'] = shopData?.ward_checkout_behavior?.trim()
    }

    return await this.ShopModel.findOneAndUpdate(
      {
        ...queryData
      },
      {
        ...updateData
      },
      {
        new: true
      }
    )
  }

  public async deleteOne(
    shopQuery: ShopQuery
  ): Promise<ShopEntity | null> {
    const queryData: Record<string, unknown> = {}

    if (shopQuery._id !== undefined) {
      queryData['_id'] = +shopQuery?._id
    }

    if (shopQuery['extension.status'] !== undefined) {
      queryData['extension.status'] = +shopQuery['extension.status']
    }

    return await this.ShopModel.findOneAndUpdate(
      {
        ...queryData
      },
      {
        $set: {
          'extension.status': ShopStatus.Deactive
        },
        $unset: {
          'extension.haravan_authorization_v2': true
        }
      },
      {
        new: true
      }
    )
  }
}
