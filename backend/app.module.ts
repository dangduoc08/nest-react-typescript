import {
  Module,
  MiddlewareConsumer,
  RequestMethod
} from '@nestjs/common'
import {
  ConfigModule
} from '@nestjs/config'
import {
  Configuration
} from './app.interface'
import {
  JSONBodyMiddleware,
  RawBodyMiddleware,
  URLEncodedBodyMiddleware
} from './app.middleware'
import {
  HaravanModule
} from './haravan'
import {
  MongooseModule
} from './mongoose'
import {
  RabbitMQModule
} from './rabbitmq'
import {
  RedisModule
} from './redis'
import {
  CronModule
} from './cron'
import {
  LoggerModule
} from './logger'
import {
  SessionModule,
  SessionAdditionMiddleware
} from './session'
import {
  ShopModule
} from './shop'
import {
  WebhookModule,
  ROUTE_V1 as WEBHOOK_ROUTE
} from './webhook'
import {
  HelperModule
} from './helper'
import {
  SampleModule
} from './sample'
import {
  UploaderModule
} from './uploader'

export class AppModuleFactory {
  private static instance: new () => {}
  constructor(appConfig: Configuration) {
    if (!AppModuleFactory.instance) {
      const haravanModules = []

      if (appConfig.haravan) {
        haravanModules.push(HaravanModule.register(appConfig.haravan))
      }

      if (appConfig.mongoose) {
        haravanModules.push(MongooseModule.register(appConfig.mongoose))
      }

      if (appConfig.rabbitMQ) {
        haravanModules.push(RabbitMQModule.register(appConfig.rabbitMQ))
      }

      if (appConfig.logger) {
        haravanModules.push(LoggerModule.register(appConfig.logger))
      }

      if (appConfig.cron) {
        haravanModules.push(CronModule.register(appConfig.cron))
      }

      if (appConfig.session) {
        haravanModules.push(SessionModule)
      }

      if (appConfig.redis) {
        haravanModules.push(RedisModule.register(appConfig.redis))
      }

      @Module({
        imports: [
          ...haravanModules,
          ConfigModule.forRoot({
            isGlobal: true,
            load: [() => ({ ...appConfig })]
          }),
          WebhookModule,
          ShopModule,
          HelperModule,
          SampleModule,
          UploaderModule
        ]
      })
      class AppModule {
        public configure(consumer: MiddlewareConsumer): void {
          consumer
            .apply(SessionAdditionMiddleware)
            .forRoutes({
              path: '*',
              method: RequestMethod.ALL
            })
            .apply(JSONBodyMiddleware, URLEncodedBodyMiddleware)
            .exclude(
              {
                path: WEBHOOK_ROUTE.HARAVAN_WEBHOOK,
                method: RequestMethod.POST
              }
            )
            .forRoutes({
              path: '*',
              method: RequestMethod.ALL
            })
            .apply(RawBodyMiddleware)
            .forRoutes(
              {
                path: WEBHOOK_ROUTE.HARAVAN_WEBHOOK,
                method: RequestMethod.POST
              }
            )
        }
      }
      AppModuleFactory.instance = AppModule
    }

    return AppModuleFactory.instance
  }
}
