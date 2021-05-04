export type SuccessResponse = {
  is_success: boolean
  message_code?: string
}

export type ErrorResponse = {
  error?: {
    path: string
    timestamp: string
    error_message: string
  }
}

export type ServerResponse<T> = { [key in keyof T]: T[keyof T] } & SuccessResponse & ErrorResponse