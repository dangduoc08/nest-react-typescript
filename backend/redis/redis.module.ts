import {
  DynamicModule,
  Module,
  Global,
  Inject
} from '@nestjs/common'
import redis, {
  RedisClient
} from 'redis'
import {
  RedisConfiguration
} from './redis.interface'
import {
  RedisService
} from './redis.service'
import {
  REDIS_CLIENT
} from './redis.constant'
import {
  LoggerService,
  LOGGER
} from '../logger'


@Global()
@Module({})
export class RedisModule {
  private static loggerService: LoggerService
  private static redisClient: RedisClient
  constructor(
    @Inject(LOGGER) private readonly loggerService: LoggerService
  ) {
    if (!RedisModule.loggerService) {
      RedisModule.loggerService = this.loggerService
    }
  }

  public static register(config: RedisConfiguration): DynamicModule {
    if (!RedisModule.redisClient) {
      const redisURL = new URL(config.url)
      const logURL: string = `${redisURL.protocol}//${redisURL.host}${redisURL.pathname}`
      RedisModule.redisClient = redis.createClient(config)

      RedisModule.redisClient.on('connect', () =>
        RedisModule.loggerService.info(logURL, 'RedisConnected'))

      RedisModule.redisClient.on('reconnecting', chan =>
        RedisModule.loggerService.warn(logURL, 'RedisReconnecting', chan))

      RedisModule.redisClient.on('warning', chan =>
        RedisModule.loggerService.warn(logURL, 'RedisReconnecting', chan))

      RedisModule.redisClient.on('end', () =>
        RedisModule.loggerService.warn(logURL, 'RedisEnd'))

      RedisModule.redisClient.on('error', err =>
        this.loggerService.error(err.message, err, 'RedisError'))
    }

    return {
      module: RedisModule,
      imports: [
        RedisModule
      ],
      exports: [
        RedisService
      ],
      providers: [
        {
          provide: REDIS_CLIENT,
          useFactory: () => RedisModule.redisClient
        },
        RedisService
      ]
    }
  }
}