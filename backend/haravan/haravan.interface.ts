import {
  IdTokenClaims,
  Issuer,
  Client
} from 'openid-client'

export interface HaravanConfiguration {
  issuerURL: string
  apiURL: string
  webhookURL: string
  appID: string
  appSecret: string
  loginScope: string
  installScope: string
  webhookVerifyToken: string
  embedded?: boolean
}

export interface HaravanOpenID {
  issuer: Issuer<Client>
  client: Client
  nonce: string
}

export interface HaravanTokenClaim extends IdTokenClaims {
  orgid?: string
  role?: Array<string>
  sid?: string
}

export interface GetAppResponse {
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

export interface GetUserResponse {
  user_id?: number
  first_name?: string
  last_name?: string
}

export interface AccessDeniedResponse {
  app_id: string
  login_url: string
  embedded: boolean
}
