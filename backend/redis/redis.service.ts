import {
  promisify
} from 'util'
import {
  Injectable,
  Inject
} from '@nestjs/common'
import {
  RedisClient
} from 'redis'
import {
  REDIS_CLIENT
} from './redis.constant'

@Injectable()
export class RedisService {
  constructor(
    @Inject(REDIS_CLIENT) private readonly redisClient: RedisClient
  ) { }
  get = promisify(this.redisClient.get).bind(this.redisClient)
  set = promisify(this.redisClient.set).bind(this.redisClient)
  // del = promisify(this.redisClient.del).bind(this.redisClient) () =>
  //  new Promise((resolve) => {
  //    this.redisClient.del()
  //  })
  del = (key: string) =>
    new Promise((resolve) => {
      this.redisClient.del(key, resolve)
    })
  expire = promisify(this.redisClient.expire).bind(this.redisClient)
  flushall = promisify(this.redisClient.flushall).bind(this.redisClient)
}