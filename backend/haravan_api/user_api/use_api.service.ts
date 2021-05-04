import {
  HttpService
} from '@nestjs/common'
import {
  AxiosResponse
} from 'axios'
import {
  GetUserQuery,
  GetUserResponse
} from './user_api.interface'

export class UserAPIService {
  constructor(
    private readonly httpService: HttpService,
    private readonly baseURL: string,
    private readonly accessToken: string
  ) {
    this.httpService = httpService
    this.baseURL = baseURL
    this.accessToken = accessToken
  }

  public async getUser({ userID }: GetUserQuery): Promise<AxiosResponse<GetUserResponse>> {
    const httpResponse = await this.httpService.get<GetUserResponse>(
      `${this.baseURL}/users/${userID}.json`,
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