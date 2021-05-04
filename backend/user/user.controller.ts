import {
  Controller,
  Inject,
  HttpException,
  InternalServerErrorException
} from '@nestjs/common'
import {
  ConsumeMessage,
  Channel as Chan
} from 'amqplib'
import {
  UserService
} from './user.service'
import {
  UserQuery,
  UserData,
  UserPayload
} from './user.interface'
import {
  UserStatus
} from './user.enum'
import {
  Subscriber,
  Message,
  Payload,
  Channel,
  Receive,
  ExchangeService
} from '../rabbitmq'
import {
  AppConfig
} from '../app.config'
import {
  LOGGER,
  LoggerService
} from '../logger'
import {
  HaravanWebhookPayload,
  WEBHOOK_TOPIC
} from '../webhook'

const rabbitMQConfig = AppConfig.load().rabbitMQ()
const userQueue: string = rabbitMQConfig.queues['user']

@Controller()
@Subscriber()
export class UserController {
  constructor(
    @Inject(rabbitMQConfig.exchanges['webhook']) readonly webhookExchange: ExchangeService,
    @Inject(LOGGER) readonly logger: LoggerService,
    readonly userService: UserService
  ) { }


  @Receive(userQueue)
  async syncUser(
    @Payload() payload: HaravanWebhookPayload<UserPayload>,
    @Message() msg: ConsumeMessage,
    @Channel() channel: Chan
  ) {
    try {
      const topic: string = payload.topic
      const orgID: number = +payload.org_id
      const userQuery: UserQuery = {
        _id: payload.data.id,
        'extension.status': UserStatus.Active
      }


      if (topic === WEBHOOK_TOPIC.USER.CREATE || topic === WEBHOOK_TOPIC.USER.UPDATE) {
        const userData: UserData = {
          account_owner: payload?.data?.account_owner,
          bio: payload?.data?.bio,
          email: payload?.data?.email,
          first_name: payload?.data?.first_name,
          im: payload?.data?.im,
          last_name: payload?.data?.last_name,
          phone: payload?.data?.phone,
          user_type: payload?.data?.user_type,
          receive_announcements: payload?.data?.receive_announcements,
          permissions: payload?.data?.permissions,
          org_id: orgID
        }
        const newUserDoc = await this.userService.upsertOne(userQuery, userData)
        if (!newUserDoc) {
          throw new InternalServerErrorException('Could not upsert user')
        }
      }

      if (topic === WEBHOOK_TOPIC.USER.DELETE) {
        const updatedUserDoc = await this.userService.deleteOne(userQuery)
        if (!updatedUserDoc) {
          throw new InternalServerErrorException('Could not deactive user')
        }
      }


      if (channel && msg) {
        channel.ack(msg)
      }
    } catch (err) {
      if (channel && msg) {
        channel.ack(msg)
      }
      this.logger.error(err?.message, err, 'syncUser', payload)
      throw new HttpException(err?.message, err?.status)
    }
  }
}