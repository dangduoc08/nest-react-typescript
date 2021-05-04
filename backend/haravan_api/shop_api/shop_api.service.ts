import {
  HttpService
} from '@nestjs/common'
import {
  AxiosResponse
} from 'axios'
import {
  GetShopResponse
} from './shop_api.interface'

export class ShopAPIService {
  constructor(
    private readonly httpService: HttpService,
    private readonly baseURL: string,
    private readonly accessToken: string
  ) {
    this.httpService = httpService
    this.baseURL = baseURL
    this.accessToken = accessToken
  }

  public async getShop(): Promise<AxiosResponse<GetShopResponse>> {
    const httpResponse = await this.httpService.get<GetShopResponse>(
      `${this.baseURL}/shop.json`,
      {
        headers: {
          Authorization: this.accessToken
        }
      }
    )
      .toPromise()

    return httpResponse
  }
}