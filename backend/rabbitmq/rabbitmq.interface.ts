import {
  Replies
} from 'amqplib'
import {
  Exchange
} from './rabbitmq.type'

interface Queue {
  [key: string]: {
    active: boolean
    name: string
    routingKey: string
    consumer: number
    durable?: boolean
    noAck?: boolean
    prefetch?: number
  }
}
export interface RabbitMQConfiguration {
  uris: string
  prefix?: string
  messageTtl?: number
  exchanges: {
    [key: string]: {
      active: boolean
      name: string
      type: Exchange
      durable?: boolean
      persistent?: boolean
      queues: Queue
    }
  }
}

export interface ExchangeService {
  publish: (routingKey: string, payload: unknown) => Promise<Replies.Empty>
}