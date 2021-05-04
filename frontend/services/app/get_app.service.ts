import {
  ServerResponse
} from '@commons/types'
import {
  serverAPIV1
} from '../server_api_v1'

export type GetAppResponse = {
  app_id: string
  app_name: string
  login_url: string
  logout_url: string
  embedded: boolean
  logo: string
  org_id?: number
  myharavan_host?: string
  myharavan_protocol?: string
  shop_name?: string
}

export type GetUserResponse = {
  user_id?: number
  first_name?: string
  last_name?: string
}

export const getAppService = (): Promise<ServerResponse<{ app: GetAppResponse, user: GetUserResponse }>> =>
  serverAPIV1.get('/apps/get.json')
