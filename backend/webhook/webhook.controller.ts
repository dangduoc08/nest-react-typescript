import {
  Controller,
  Get,
  Post,
  Res,
  Query,
  Body,
  HttpStatus,
  HttpException,
  Inject,
  Headers,
  HttpCode,
  UseGuards,
  UsePipes,
  InternalServerErrorException
} from '@nestjs/common'
import {
  ConfigService
} from '@nestjs/config'
import {
  Response
} from 'express'
import {
  ROUTE_V1,
  WEBHOOK_TOPIC
} from './webhook.constant'
import {
  SubscribeWebhookDto,
  WebhookHeaderDto,
  AppWebhookBodyDto,
  ShopWebhookBodyDto,
  UserWebhookBodyDto
} from './webhook.dto'
import {
  WebhookService
} from './webhook.service'
import {
  HaravanWebhookGuard
} from './webhook.guard'
import {
  TransformWebhookData
} from './webhook.pipe'
import {
  HaravanWebhookPayload,
  SubscribeWebhookResponse
} from './webhook.interface'
import {
  LoggerService,
  LOGGER
} from '../logger'
import {
  HaravanConfiguration
} from '../haravan'
import {
  ExchangeService
} from '../rabbitmq'
import {
  AppConfig
} from '../app.config'

const rabbitMQConfig = AppConfig.load().rabbitMQ()
@Controller()
export class WebhookController {
  private readonly haravanConfig: HaravanConfiguration | undefined

  constructor(
    @Inject(LOGGER) private readonly logger: LoggerService,
    @Inject(rabbitMQConfig.exchanges['webhook']) private readonly webhookExchange: ExchangeService,
    private readonly configService: ConfigService,
    private readonly webhookService: WebhookService
  ) {
    this.haravanConfig = this.configService.get('haravan')
  }

  @Get(ROUTE_V1.HARAVAN_WEBHOOK)
  public async subscribeHaravanWebhook(
    @Query() query: SubscribeWebhookDto,
    @Res() res: Response
  ): Promise<void> {
    try {
      const webhookResponse: SubscribeWebhookResponse =
        await this.webhookService.subcribeWebhook(query, this.haravanConfig)

      res
        .status(webhookResponse.status)
        .send(webhookResponse.message)
    } catch (err) {
      this.logger.error(err.message, err, 'subscribeHaravanWebhook')
      throw new HttpException(err?.message, err?.status)
    }
  }

  @UseGuards(HaravanWebhookGuard)
  @UsePipes(TransformWebhookData)
  @Post(ROUTE_V1.HARAVAN_WEBHOOK)
  @HttpCode(HttpStatus.OK)
  public async receiveHaravanWebhook(
    @Body() body: AppWebhookBodyDto
      | ShopWebhookBodyDto
      | UserWebhookBodyDto,
    @Headers() headers: WebhookHeaderDto
  ): Promise<void> {
    try {
      const topic: string = headers['x-haravan-topic']
      const org_id: string = headers['x-haravan-org-id']
      const payload: HaravanWebhookPayload<typeof body> = {
        topic,
        org_id: +org_id,
        data: body
      }
      let hasPublished
      switch (topic) {
        case WEBHOOK_TOPIC.APP.UNINSTALLED: {
          hasPublished = await this.webhookExchange.publish(
            rabbitMQConfig.routingKeys['app'],
            payload
          )
          return
        }

        case WEBHOOK_TOPIC.SHOP.UPDATE: {
          hasPublished = await this.webhookExchange.publish(
            rabbitMQConfig.routingKeys['shop'],
            payload
          )
          return
        }

        case WEBHOOK_TOPIC.USER.CREATE:
        case WEBHOOK_TOPIC.USER.UPDATE:
        case WEBHOOK_TOPIC.USER.DELETE: {
          hasPublished = await this.webhookExchange.publish(
            rabbitMQConfig.routingKeys['user'],
            payload
          )
          return
        }
      }

      if (!hasPublished) {
        throw new InternalServerErrorException(
          `Topic: ${topic} error`
        )
      }
      return
    } catch (err) {
      this.logger.error(err?.message, err, 'receiveHaravanWebhook')
      throw new HttpException(err?.message, err?.status)
    }
  }
}