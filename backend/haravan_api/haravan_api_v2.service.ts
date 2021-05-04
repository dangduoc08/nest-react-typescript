import {
  Injectable,
  HttpService
} from '@nestjs/common'
import {
  ConfigService
} from '@nestjs/config'
import {
  API,
  APIInstance
} from './haravan_api.type'
import {
  ShopAPIService
} from './shop_api'
import {
  UserAPIService
} from './user_api'
import {
  WebhookAPIService
} from './webhook_api'
import {
  HaravanConfiguration
} from '../haravan'

@Injectable({})
export class HaravanAPIV2Service {
  private readonly haravanConfig: HaravanConfiguration | undefined
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {
    this.haravanConfig = this.configService.get('haravan')
  }

  public new(accessToken: string): ({ select<T extends API>(type: T): APIInstance<T> }) | undefined {
    if (this.haravanConfig) {
      const {
        apiURL,
        webhookURL
      } = this.haravanConfig
      const apiURLV2 = `${apiURL}/com`

      return ({
        select: <T extends API>(type: T): APIInstance<T> => {
          switch (type) {
            case 'shop':
              return new ShopAPIService(
                this.httpService,
                apiURLV2,
                accessToken
              ) as unknown as APIInstance<T>

            case 'user':
              return new UserAPIService(
                this.httpService,
                apiURLV2,
                accessToken
              ) as unknown as APIInstance<T>
              
            case 'webhook':
              return new WebhookAPIService(
                this.httpService,
                webhookURL,
                accessToken
              ) as unknown as APIInstance<T>
            default:
              return undefined as unknown as APIInstance<T>
          }
        }
      })
    }

    return
  }
}
