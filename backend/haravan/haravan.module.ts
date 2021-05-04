import {
  DynamicModule,
  Module,
  Inject,
  MiddlewareConsumer,
  RequestMethod,
  HttpModule
} from '@nestjs/common'
import {
  Issuer,
  Client,
  custom,
  generators
} from 'openid-client'
import {
  HaravanController
} from './haravan.controller'
import {
  HaravanConfiguration,
  HaravanOpenID
} from './haravan.interface'
import {
  OPEN_ID,
  ROUTE_V1 as HARAVAN_ROUTE
} from './haravan.constant'
import {
  SessionAuthenticationMiddleware
} from './haravan.middleware'
import {
  ShopModule
} from '../shop'
import {
  HaravanAPIV2Module
} from '../haravan_api'
import {
  UserModule
} from '../user'
import {
  UserActivityLogModule
} from '../user_activity_log'
import {
  LoggerService,
  LOGGER
} from '../logger'
import {
  ROUTE_V1 as WEBHOOK_ROUTE
} from '../webhook'
import {
  ROUTE as UPLOADER_ROUTE
} from '../uploader'

@Module({})
export class HaravanModule {
  private static logger: LoggerService

  constructor(
    @Inject(LOGGER) private readonly logger: LoggerService
  ) {
    if (!HaravanModule.logger) {
      HaravanModule.logger = this.logger
    }
  }

  public static register(config: HaravanConfiguration): DynamicModule {
    return {
      module: HaravanModule,
      imports: [
        ShopModule,
        HaravanAPIV2Module,
        UserModule,
        UserActivityLogModule,
        HttpModule
      ],
      controllers: [
        HaravanController
      ],
      providers: [
        {
          provide: OPEN_ID,
          useFactory: async (): Promise<HaravanOpenID | undefined> => {
            if (config) {
              const {
                issuerURL,
                appID,
                appSecret
              } = config
              try {
                custom.setHttpOptionsDefaults({
                  timeout: 30000
                })
                const issuer: Issuer<Client> = await Issuer.discover(issuerURL)
                const client = new issuer.Client({
                  client_id: appID,
                  client_secret: appSecret
                })
                client[custom.clock_tolerance] = 30
                const nonce: string = generators.nonce()

                return {
                  issuer,
                  client,
                  nonce
                }
              } catch (err) {
                HaravanModule.logger.error(err.message, err, 'LoadOpenId')
                throw new Error(err)
              }
            }
          }
        }
      ]
    }
  }

  public configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(SessionAuthenticationMiddleware)
      .exclude(
        HARAVAN_ROUTE.INSTALL,
        HARAVAN_ROUTE.LOGIN,
        HARAVAN_ROUTE.LOGOUT,
        WEBHOOK_ROUTE.HARAVAN_WEBHOOK
      )
      .forRoutes(
        {
          path: '/api/*',
          method: RequestMethod.ALL
        },
        {
          path: HARAVAN_ROUTE.HARAVAN_API,
          method: RequestMethod.ALL
        },
        {
          path: '/files/*',
          method: RequestMethod.ALL
        }
      )
  }
}
