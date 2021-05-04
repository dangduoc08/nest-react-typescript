import {
  PayloadAction
} from '@reduxjs/toolkit'
import {
  createSlice
} from '@store'
import {
  ServerResponse,
  ErrorResponse
} from '@commons/types'
import {
  GetAppResponse,
  GetUserResponse
} from '@services/app'
import {
  AppState,
  NotificationState
} from './app.interface'

export const initialState: AppState = {
  startAppPending: false,
  shop: {
    appID: '',
    appName: '',
    logoutURL: '',
    shopName: '',
    logo: '',
    embedded: false
  },
  user: {
    userID: 0,
    firstName: '',
    lastName: ''
  },
  errorMessage: null,
  isLoading: false,
  numLoading: 0,
  notification: {
    message: '',
    options: {}
  }
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    startAppRequest(state) {
      state.startAppPending = true
    },

    startAppSuccess(
      state,
      { payload }: PayloadAction<ServerResponse<{ app: GetAppResponse, user: GetUserResponse }>>
    ) {
      const app = payload?.app as GetAppResponse
      const user = payload?.user as GetUserResponse
      state.startAppPending = false
      state.shop.appID = app?.app_id ?? initialState.shop.appID
      state.shop.appName = app?.app_name ?? initialState.shop.appName
      state.shop.embedded = app?.embedded ?? initialState.shop.embedded
      state.shop.logoutURL = app?.logout_url ?? initialState.shop.logoutURL
      state.shop.logo = app?.logo ?? initialState.shop.logo
      state.shop.shopName = app?.shop_name ?? initialState.shop.shopName
      state.user.userID = user?.user_id ?? initialState.user.userID
      state.user.firstName = user?.first_name ?? initialState.user.firstName
      state.user.lastName = user?.last_name ?? initialState.user.lastName
    },

    startAppFailure(state, action: PayloadAction<ServerResponse<ErrorResponse>>) {
      const {
        payload
      } = action
      state.startAppPending = false
      state.errorMessage = payload?.error?.error_message ?? initialState.errorMessage
    },

    showLoading(
      state,
      action: PayloadAction<number>
    ) {
      const {
        payload
      } = action
      state.numLoading = payload
    },

    notifySuccess(state, { payload: { message = '', options = {} } }: PayloadAction<NotificationState>) {
      state.notification.message = message
      state.notification.options = {
        variant: 'success'
      }
      if (options?.autoHideDuration) {
        state.notification.options.autoHideDuration = options.autoHideDuration
      }
    },

    notifyInfo(state, { payload: { message = '', options = {} } }: PayloadAction<NotificationState>) {
      state.notification.message = message
      state.notification.options = {
        variant: 'info'
      }
      if (options) {
        state.notification.options.autoHideDuration = options.autoHideDuration
      }
    },

    notifyWarning(state, { payload: { message = '', options = {} } }: PayloadAction<NotificationState>) {
      state.notification.message = message
      state.notification.options = {
        variant: 'warning'
      }
      if (options?.autoHideDuration) {
        state.notification.options.autoHideDuration = options.autoHideDuration
      }
    },

    notifyError(state, { payload: { message = '', options = {} } }: PayloadAction<NotificationState>) {
      state.notification.message = message
      state.notification.options = {
        variant: 'error'
      }
      if (options?.autoHideDuration) {
        state.notification.options.autoHideDuration = options.autoHideDuration
      }
    }
  }
})

export const {
  actions,
  reducer,
  name: key
} = appSlice
