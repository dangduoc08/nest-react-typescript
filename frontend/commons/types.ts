import {
  Saga
} from 'redux-saga'
import {
  Reducer
} from '@reduxjs/toolkit'

export type ModuleExport = { default: React.ComponentType } & {
  key?: string
  reducer?: Reducer
  saga?: Saga
}

export type SuccessResponse = {
  is_success: boolean
  message_code?: string
}

export type AccessDeniedResponse = {
  app: {
    app_id: string
    login_url: string
    embedded: boolean
  }
}

export type ErrorResponse = {
  error?: {
    path: string
    timestamp: string
    error_message: string
  }
}

export type ServerResponse<T> = { [key in keyof T]: T[keyof T] } & SuccessResponse & ErrorResponse