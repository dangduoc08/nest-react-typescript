import {
  Controller,
  Inject,
  HttpException,
  NotFoundException,
  UnprocessableEntityException,
  InternalServerErrorException
} from '@nestjs/common'
import {
  Channel as Chan,
  ConsumeMessage
} from 'amqplib'
import {
  ShopService
} from './shop.service'
import {
  ShopQuery,
  AppWebhookData
} from './shop.interface'
import {
  ShopUpdateBodyDto
} from './shop.dto'
import {
  ShopStatus
} from './shop.enum'
import {
  Receive,
  Payload,
  Subscriber,
  Channel,
  Message
} from '../rabbitmq'
import {
  HaravanWebhookPayload
} from '../webhook'
import {
  SessionService,
  SessionQueryData
} from '../session'
import {
  AppConfig
} from '../app.config'
import {
  LoggerService,
  LOGGER
} from '../logger'

const rabbitMQConfig = AppConfig.load().rabbitMQ()
const shopQueue: string = rabbitMQConfig.queues['shop']
const appQueue: string = rabbitMQConfig.queues['app']

@Controller({})
@Subscriber()
export class ShopController {
  constructor(
    private shopService: ShopService,
    private sessionService: SessionService,
    @Inject(LOGGER) readonly logger: LoggerService
  ) { }


  @Receive(appQueue)
  async uninstallApp(
    @Payload() payload: HaravanWebhookPayload<AppWebhookData>,
    @Channel() channel: Chan,
    @Message() msg: ConsumeMessage
  ) {
    try {
      if (payload?.data?.org_id) {
        const orgID = +payload?.data?.org_id

        const shopQueryData: ShopQuery = {
          _id: orgID
        }
        const oldShopDoc = await this.shopService.getOne({
          ...shopQueryData,
          'extension.status': ShopStatus.Active
        })
        if (!oldShopDoc) {
          throw new NotFoundException('Could not find shop')
        }

        const newShopDoc = await this.shopService.deleteOne(shopQueryData)
        if (!newShopDoc) {
          throw new InternalServerErrorException('Could not uninstallApp shop')
        }

        const sessionQueryData: SessionQueryData = {
          org_id: orgID
        }
        await this.sessionService.deleteMany(sessionQueryData)
      } else {
        throw new UnprocessableEntityException('org_id should not be empty')
      }

      if (channel && msg) {
        channel.ack(msg)
      }
      return
    } catch (err) {
      if (channel && msg) {
        channel.ack(msg)
      }
      this.logger.error(err?.message, err, 'uninstallApp', payload)
      throw new HttpException(err?.message, err?.status)
    }
  }

  @Receive(shopQueue)
  async syncShop(
    @Payload() payload: HaravanWebhookPayload<ShopUpdateBodyDto>,
    @Channel() channel: Chan,
    @Message() msg: ConsumeMessage
  ): Promise<void> {
    try {
      const shopQueryData: ShopQuery = {
        _id: +payload?.data?.id,
        'extension.status': ShopStatus.Active
      }
      await this.shopService.updateOne(shopQueryData, payload.data)

      if (channel && msg) {
        channel.ack(msg)
      }
      return
    } catch (err) {
      if (channel && msg) {
        channel.ack(msg)
      }
      this.logger.error(err?.message, err, 'syncShop', payload)
      throw new HttpException(err?.message, err?.status)
    }
  }
}
