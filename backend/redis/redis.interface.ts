import {
  ClientOpts
} from 'redis'

export interface RedisConfiguration extends ClientOpts {
  url: string
}