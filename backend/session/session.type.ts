export type SessionResponse = {
  org_id?: number
  user_id?: number
  sid?: string
  access_token?: string
  expires_at?: Date
  role: string[]
  user_extension?: {
    first_name?: string
    last_name?: string
  }
  shop_extension?: {
    name?: string
    myharavan_domain?: string
  }
  extension?: {
    haravan_access_token_v2?: string
    app_permissions?: string[]
  }
}
