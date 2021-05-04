import {
  Configuration
} from './app.interface'
import {
  CronRegister
} from './app.register'
import {
  CronOption,
  CronConfiguration
} from './cron'
import {
  LoggerModule
} from './logger'
import {
  UploaderConfiguration
} from './uploader'

export class AppConfig {
  private static dir: string = 'configs'
  private constructor(public env: string, public file: string, public appConfig: Configuration) {
    this.env = env
    this.file = file
    this.appConfig = appConfig
  }
  private static instance: AppConfig
  private static hasRabbitMQFlatten: boolean
  private static flatRabbitMQConfig: Record<string, { [key: string]: string }> = {
    exchanges: {},
    queues: {},
    routingKeys: {}
  }
  private static envMapping: Record<string, { env: string, configFile: string }> = {
    development: {
      env: 'development',
      configFile: 'development.config'
    },
    staging: {
      env: 'staging',
      configFile: 'staging.config'
    },
    production: {
      env: 'production',
      configFile: 'production.config'
    },
    test: {
      env: 'test',
      configFile: 'development.config'
    }
  }

  private static addNameToCron = (cronConfiguration?: CronConfiguration<CronRegister>) => {
    for (const key in cronConfiguration) {
      cronConfiguration[key].name = key
    }
  }

  public static load(): AppConfig {
    let loadedFile = null
    const env: string = process.env.NODE_ENV || AppConfig.envMapping.development.env
    try {
      if (!AppConfig.instance && !loadedFile) {
        const file: string = AppConfig.envMapping[env].configFile
        loadedFile = require(`./${AppConfig.dir}/${file}`)
        if (!loadedFile) {
          throw new Error(
            `Cannot find module './${AppConfig.dir}/${file}'`
          )
        }
        const appConfig: Configuration = loadedFile.appConfig
        AppConfig.instance = new AppConfig(env, file, appConfig)
        AppConfig.addNameToCron(appConfig.cron)
      }
      return AppConfig.instance
    } catch (err) {
      if (!AppConfig.instance && !loadedFile) {
        const file: string = 'default.config'
        loadedFile = require(`./${AppConfig.dir}/${file}`)
        const appConfig: Configuration = loadedFile.appConfig
        AppConfig.instance = new AppConfig(env, file, appConfig)
        AppConfig.addNameToCron(appConfig.cron)
      }
      LoggerModule.error(
        err.message, err,
        'load',
        null,
        AppConfig.instance.logger()
      )
      return AppConfig.instance
    }
  }

  public mongoose() {
    return this.appConfig?.mongoose
  }

  public logger() {
    return this.appConfig?.logger
  }

  public app = (key?: string) => key
    ? this.appConfig?.app?.[key]
    : this.appConfig?.app

  public cron(key: CronRegister): CronOption {
    if (!this.appConfig.cron) {
      throw new Error(
        'Cannot find cron configuration'
      )
    }
    return this.appConfig.cron[key]
  }

  public rabbitMQ() {
    if (!AppConfig.hasRabbitMQFlatten) {
      const prefix = this.appConfig.rabbitMQ?.prefix
      for (const exchangeKey in this.appConfig.rabbitMQ?.exchanges) {
        const exchange = this.appConfig.rabbitMQ?.exchanges[exchangeKey]
        if (exchange?.active) {
          AppConfig.flatRabbitMQConfig.exchanges[exchangeKey] = prefix
            ? `${prefix}_${exchange?.name}`
            : exchange.name
          for (const queueKey in exchange?.queues) {
            const queue = exchange.queues[queueKey]
            if (queue.active) {
              AppConfig.flatRabbitMQConfig.queues[queueKey] = prefix
                ? `${prefix}_${queue?.name}`
                : queue.name
              AppConfig.flatRabbitMQConfig.routingKeys[queueKey] = queue.routingKey
            }
          }
        }
      }
      AppConfig.hasRabbitMQFlatten = true
    }

    return AppConfig.flatRabbitMQConfig
  }

  public uploader = <T>(key?: keyof UploaderConfiguration): T => key
    ? this.appConfig?.uploader?.[key] as unknown as T
    : this.appConfig?.uploader as unknown as T
}