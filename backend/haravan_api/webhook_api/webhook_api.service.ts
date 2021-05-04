import {
  HttpService
} from '@nestjs/common'
import {
  AxiosResponse
} from 'axios'
import {
  SubscribeWebhookResponse
} from './webhook_api.interface'

export class WebhookAPIService {
  constructor(
    private readonly httpService: HttpService,
    private readonly baseURL: string,
    private readonly accessToken: string
  ) {
    this.httpService = httpService
    this.baseURL = baseURL
    this.accessToken = accessToken
  }

  public async subcribeWebhook(): Promise<AxiosResponse<SubscribeWebhookResponse>> {
    const httpResponse = await this.httpService.post<SubscribeWebhookResponse>(
      `${this.baseURL}/api/subscribe`,
      {},
      {
        headers: {
          Authorization: this.accessToken,
          'Content-Type': 'application/json'
        }
      }
    )
      .toPromise()

    return httpResponse
  }
}