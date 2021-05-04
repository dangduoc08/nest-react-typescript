import {
  DynamicModule,
  Module,
  Global,
  Inject
} from '@nestjs/common'
import {
  connect,
  connection,
  model as createModel,
  set,
  Schema
} from 'mongoose'
import {
  MongooseConfiguration,
  MongooseModel
} from './mongoose.interface'
import {
  LoggerService,
  LOGGER
} from '../logger'

@Global()
@Module({})
export class MongooseModule {
  private static isInitialize: boolean
  private static logger: LoggerService
  private static config: MongooseConfiguration
  private static models = new Map()
  constructor(
    @Inject(LOGGER) private readonly logger: LoggerService
  ) {
    if (!MongooseModule.logger) {
      MongooseModule.logger = this.logger
    }
  }

  public static register(config: MongooseConfiguration): DynamicModule {
    const mongooseURL = new URL(config.uris)
    const logURL: string = `${mongooseURL.protocol}//${mongooseURL.host}${mongooseURL.pathname}`

    if (!MongooseModule.isInitialize) {
      connect(config.uris, config.connectionOptions || {})
        .catch(err => MongooseModule.logger.error(err.message, err, 'MongooseError'))

      config.debug
        ? set('debug', { debug: config.debug })
        : null

      connection.on('open', () =>
        MongooseModule.logger.info(logURL, 'MongooseConnected'))

      connection.on('reconnected', () =>
        MongooseModule.logger.info(logURL, 'MongooseReconnected'))

      connection.on('disconnected', () =>
        MongooseModule.logger.warn(logURL, 'MongooseDisconnected'))

      connection.on('close', () =>
        MongooseModule.logger.warn(logURL, 'MongooseClose'))

      MongooseModule.config = config
    }
    MongooseModule.isInitialize = true

    return {
      module: MongooseModule
    }
  }

  public static useSchema(models: MongooseModel[]): DynamicModule {
    const providers = models.map(model => ({
      provide: model.name,
      useFactory: () => {
        const collectionPrefix = MongooseModule.config.prefix
        const modelName = collectionPrefix
          ? collectionPrefix + '_' + model.name
          : model.name

        let schema: Schema
        if (!MongooseModule.models.has(modelName)) {
          schema = model.schema
          MongooseModule.models.set(modelName, schema)
        } else {
          schema = MongooseModule.models.get(modelName)
        }

        return createModel(
          modelName,
          schema
        )
      }
    }))

    return {
      module: MongooseModule,
      providers,
      exports: providers
    }
  }
}
