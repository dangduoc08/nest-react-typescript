import {
  ShopAPIService
} from './shop_api'
import {
  UserAPIService
} from './user_api'
import {
  WebhookAPIService
} from './webhook_api'

export type API = 'shop'
  | 'user'
  | 'webhook'

export type APIInstance<T extends API>
  = T extends 'shop'
  ? ShopAPIService
  : T extends 'user'
  ? UserAPIService
  : T extends 'webhook'
  ? WebhookAPIService
  : undefined
