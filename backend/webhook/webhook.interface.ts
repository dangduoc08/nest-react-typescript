export interface HaravanWebhookPayload<T> {
  topic: string
  org_id: number
  data: T
}

export interface ShopeeWebhookPayload<T> {
  code: number
  data: T
}

export interface SubscribeWebhookResponse {
  message: string
  status: number
}
