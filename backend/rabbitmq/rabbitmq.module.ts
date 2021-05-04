import * as amqp from 'amqp-connection-manager'
import {
  EventEmitter
} from 'events'
import {
  Channel,
  Replies
} from 'amqplib'
import {
  DynamicModule,
  Module,
  Global,
  Inject
} from '@nestjs/common'
import {
  RabbitMQConfiguration,
  ExchangeService
} from './rabbitmq.interface'
import {
  LoggerService,
  LOGGER
} from '../logger'

@Global()
@Module({})
export class RabbitMQModule {
  private static logger: LoggerService
  public static subcribeEvent = new EventEmitter()

  constructor(
    @Inject(LOGGER) private readonly logger: LoggerService
  ) {
    if (!RabbitMQModule.logger) {
      RabbitMQModule.logger = this.logger
    }
  }

  public static register(config: RabbitMQConfiguration): DynamicModule {
    const defaultConfig = {
      exchangeDurable: true,
      queueDurable: true,
      noAck: false,
      persistent: true,
      prefetch: 1
    }

    const connection = amqp.connect([
      config.uris
    ])

    connection.on('connect', conn => {
      const rabbitmqURL = new URL(conn.url)
      const logURL: string = `${rabbitmqURL.protocol}//${rabbitmqURL.host}${rabbitmqURL.pathname}`
      RabbitMQModule.logger.info(logURL, 'RabbitMQConnected')
    })

    connection.on('disconnect', ({ err }) =>
      RabbitMQModule.logger.error(err.message, err, 'RabbitMQDisconnected')
    )

    const channelWrapper = connection.createChannel({
      setup: (channel: Channel) => {
        for (const exchangeKey in config.exchanges) {
          const exchange = config.exchanges[exchangeKey]
          const {
            active,
            type,
            queues,
            durable: exchangeDurable
          } = exchange
          let {
            name: exchangeName
          } = exchange
          if (active) {
            exchangeName = config.prefix
              ? `${config.prefix}_${exchangeName}`
              : exchangeName

            channel.assertExchange(exchangeName, type, {
              durable: exchangeDurable !== false
                ? defaultConfig.exchangeDurable
                : exchangeDurable
            })
            for (const queueKey in queues) {
              const queue = queues[queueKey]
              const {
                active,
                consumer,
                noAck,
                prefetch,
                durable: queueDurable,
                routingKey
              } = queue
              let {
                name: queueName
              } = queue
              if (active) {
                if (prefetch) {
                  channel.prefetch(prefetch)
                } else {
                  channel.prefetch(defaultConfig.prefetch)
                }
                queueName = config.prefix
                  ? `${config.prefix}_${queueName}`
                  : queueName
                const options = {
                  durable: queueDurable !== false
                    ? defaultConfig.queueDurable
                    : queueDurable
                }
                if (config.messageTtl) {
                  options['messageTtl'] = config.messageTtl
                }

                channel.assertQueue(
                  queueName,
                  options
                )
                channel.bindQueue(queueName, exchangeName, routingKey)
                for (let i = 0; i < consumer; i++) {
                  channel.consume(
                    queueName,
                    msg =>
                      RabbitMQModule.subcribeEvent.emit(queueName, msg, channel),
                    {
                      noAck: noAck || defaultConfig.noAck
                    }
                  )
                }
              }
            }
          }
        }
      }
    })

    const providers = []
    for (const exchangeKey in config.exchanges) {
      const exchange = config.exchanges[exchangeKey]
      const exchangeName = config.prefix
        ? `${config.prefix}_${exchange.name}`
        : exchange.name

      providers.push(({
        provide: exchangeName,
        useFactory: (): ExchangeService => ({
          publish: (routingKey: string, payload: unknown): Promise<Replies.Empty> =>
            new Promise((resolve, reject) => {
              if (payload !== undefined) {
                const payloadStr: string = JSON.stringify(payload)
                const payloadBuf = Buffer.from(payloadStr)
                channelWrapper.publish(
                  exchangeName,
                  routingKey,
                  payloadBuf,
                  {
                    persistent: exchange.persistent !== false
                      ? defaultConfig.persistent
                      : exchange.persistent
                  },
                  (err, ok) => {
                    if (err) {
                      return reject(err)
                    }
                    return resolve(ok)
                  }
                )
              }
            })
        })
      }))
    }

    return {
      module: RabbitMQModule,
      providers,
      exports: providers
    }
  }
}