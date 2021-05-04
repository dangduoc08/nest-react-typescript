import {
  SessionOptions
} from 'express-session'
import {
  CronRegister
} from './app.register'
import {
  MongooseConfiguration
} from './mongoose'
import {
  LoggerConfiguration
} from './logger'
import {
  HaravanConfiguration
} from './haravan'
import {
  RabbitMQConfiguration
} from './rabbitmq'
import {
  RedisConfiguration
} from './redis'
import {
  CronConfiguration
} from './cron'
import {
  UploaderConfiguration
} from './uploader'

export interface Configuration {
  app: AppConfiguration
  logger?: LoggerConfiguration
  haravan?: HaravanConfiguration
  session?: SessionOptions
  mongoose?: MongooseConfiguration
  rabbitMQ?: RabbitMQConfiguration
  cron?: CronConfiguration<CronRegister>
  redis?: RedisConfiguration
  uploader?: UploaderConfiguration
}

export interface AppConfiguration {
  name: string
  port: number
  domain: string
  logo: string
  host?: string
  tunnel?: string
}

export interface RedirectResponse {
  url: string
  statusCode?: number
}
