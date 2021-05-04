import {
  OptionsObject
} from 'notistack'

export interface NotificationState {
  message: string
  options?: OptionsObject
}
export interface AppState {
  shop: {
    appID: string
    appName: string
    embedded: boolean
    logoutURL: string
    shopName: string
    logo: string
  }
  user: {
    userID: number
    firstName: string
    lastName: string
  }
  startAppPending: boolean
  errorMessage: string | null
  isLoading: boolean
  notification: NotificationState
  numLoading: number
}