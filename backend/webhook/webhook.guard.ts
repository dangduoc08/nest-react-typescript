import * as crypto from 'crypto'
import {
  Injectable,
  CanActivate,
  ExecutionContext
} from '@nestjs/common'
import {
  ConfigService
} from '@nestjs/config'
import {
  WebhookHeaderDto
} from './webhook.dto'
import {
  HaravanConfiguration
} from '../haravan'

@Injectable()
export class HaravanWebhookGuard implements CanActivate {
  private readonly haravanConfig: HaravanConfiguration | undefined

  constructor(private configService: ConfigService) {
    this.haravanConfig = this.configService.get('haravan')
  }

  canActivate(
    context: ExecutionContext
  ): boolean {
    if (this.haravanConfig) {
      const request = context.switchToHttp().getRequest()
      const headers: WebhookHeaderDto = request.headers
      const haravanHmac: string = headers['x-haravan-hmacsha256']
      const encodedHash: string = crypto
        .createHmac('sha256', this.haravanConfig.appSecret)
        .update(request.body.toString(), 'utf8')
        .digest('base64')

      return haravanHmac === encodedHash
    }

    return false
  }
}
