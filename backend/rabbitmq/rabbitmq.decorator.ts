import {
  InternalServerErrorException
} from '@nestjs/common'
import {
  Channel as Chan,
  ConsumeMessage
} from 'amqplib'
import {
  RabbitMQModule
} from './rabbitmq.module'
import {
  RABBITMQ_META
} from './rabbitmq.constant'

const Subscriber = () =>
  function <T extends new (...agrs: any[]) => object>(Constructor: T) {
    return class extends Constructor {
      constructor(...args: any[]) {
        super(...args)
        const metaDataKeys = Reflect.getMetadataKeys(this) || []
        metaDataKeys.forEach((key: string) => {
          const queueName: string = Reflect.getMetadata(key, this)[RABBITMQ_META.QUEUE]
          if (queueName) {
            RabbitMQModule.subcribeEvent.addListener(
              queueName,
              (...args) => {
                try {
                  const msg: ConsumeMessage = args[0]
                  const payloadIndex: number = Reflect.getMetadata(key, this)[RABBITMQ_META.PAYLOAD]
                  const messageIndex: number = Reflect.getMetadata(key, this)[RABBITMQ_META.MESSAGE]
                  const channelIndex: number = Reflect.getMetadata(key, this)[RABBITMQ_META.CHANNEL]
                  const dynamicArgs = []
                  if (!isNaN(payloadIndex)) {
                    const payload = JSON.parse(msg.content.toString())
                    dynamicArgs[payloadIndex] = payload
                  }
                  if (!isNaN(messageIndex)) {
                    dynamicArgs[messageIndex] = msg
                  }
                  if (!isNaN(channelIndex)) {
                    const channel: Chan = args[1]
                    dynamicArgs[channelIndex] = channel
                  }
                  Reflect.getMetadata(key, this)[RABBITMQ_META.METHOD].apply(this, dynamicArgs)
                } catch (err) {
                  throw new InternalServerErrorException(err)
                }
              })
          }
        })
      }
    }
  }

const Receive = (queue: string) =>
  function (target: object, key: string, descriptor: PropertyDescriptor) {
    const metaData = Reflect.getMetadata(key, target)
    if (!metaData) {
      const value = {
        [RABBITMQ_META.METHOD]: descriptor.value,
        [RABBITMQ_META.QUEUE]: queue
      }
      Reflect.defineMetadata(key, value, target)
    } else {
      metaData[RABBITMQ_META.METHOD] = descriptor.value
      metaData[RABBITMQ_META.QUEUE] = queue
      Reflect.defineMetadata(key, metaData, target)
    }
    return descriptor
  }

const Channel = () =>
  function (target: object, key: string, index: number) {
    const metaData = Reflect.getMetadata(key, target)
    if (!metaData) {
      const value = {
        [RABBITMQ_META.CHANNEL]: index
      }
      Reflect.defineMetadata(key, value, target)
    } else {
      metaData[RABBITMQ_META.CHANNEL] = index
      Reflect.defineMetadata(key, metaData, target)
    }
  }

const Message = () =>
  function (target: object, key: string, index: number) {
    const metaData = Reflect.getMetadata(key, target)
    if (!metaData) {
      const value = {
        [RABBITMQ_META.MESSAGE]: index
      }
      Reflect.defineMetadata(key, value, target)
    } else {
      metaData[RABBITMQ_META.MESSAGE] = index
      Reflect.defineMetadata(key, metaData, target)
    }
  }

const Payload = () =>
  function (target: object, key: string, index: number) {
    const metaData = Reflect.getMetadata(key, target)
    if (!metaData) {
      const value = {
        [RABBITMQ_META.PAYLOAD]: index
      }
      Reflect.defineMetadata(key, value, target)
    } else {
      metaData[RABBITMQ_META.PAYLOAD] = index
      Reflect.defineMetadata(key, metaData, target)
    }
  }

export {
  Subscriber,
  Receive,
  Payload,
  Channel,
  Message
}