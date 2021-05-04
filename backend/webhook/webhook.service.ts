import {
  Injectable,
  HttpStatus
} from '@nestjs/common'
import {
  SubscribeWebhookDto
} from './webhook.dto'
import {
  SubscribeWebhookResponse
} from './webhook.interface'
import {
  HaravanConfiguration
} from '../haravan'

@Injectable()
export class WebhookService {
  public subcribeWebhook(
    query: SubscribeWebhookDto,
    config?: HaravanConfiguration
  ): SubscribeWebhookResponse {
    const isVerified: boolean = query['hub.verify_token'] === config?.webhookVerifyToken

    return isVerified
      ? {
        status: HttpStatus.OK,
        message: query['hub.challenge']
      }
      : {
        status: HttpStatus.UNAUTHORIZED,
        message: 'Verify token is invalid'
      }
  }
}