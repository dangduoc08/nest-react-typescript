import createApp, {
  actions as haravanActions
} from '@haravan/app-sdk'
import {
  all,
  takeLatest,
  put,
  call,
  select
} from 'redux-saga/effects'
import {
  RouterState
} from 'connected-react-router'
import {
  RootState
} from '@commons/interfaces'
import {
  AccessDeniedResponse,
  ServerResponse
} from '@commons/types'
import {
  CONTAINER
} from '@commons/constants'
import {
  getAppService,
  GetAppResponse,
  GetUserResponse
} from '@services/app'
import {
  actions
} from './app.slice'

function* startAppRequest() {
  try {
    const getAppResponse: ServerResponse<{ app: GetAppResponse, user: GetUserResponse }> = yield call(getAppService)
    const routerState: RouterState = yield (select((state: RootState) => state.router))
    const urlParams = new URLSearchParams(routerState.location.search)
    const orgIDQuery: string | null = urlParams.get('orgid')
    const pathname: string = routerState?.location?.pathname
    const isErrorPage: boolean = pathname === CONTAINER.ERROR.PATH || pathname === CONTAINER.PERMISSION.PATH
    const {
      is_success: isSuccess
    } = getAppResponse
    const app = getAppResponse.app as GetAppResponse

    const hasOrgID: boolean = !!app?.org_id
    const hasQueryOrgID: boolean = !!orgIDQuery
    const matchQuery: boolean = orgIDQuery === app?.org_id?.toString()

    if (!isErrorPage) {
      if (getAppResponse && hasQueryOrgID && !matchQuery) {
        return window.location.href = app.login_url
      }

      if (isSuccess && hasOrgID) {
        const apiKey: string = app?.app_id ?? ''
        const embedded: boolean = app?.embedded ?? false
        const shopOrigin: string = app?.myharavan_host ?? ''

        createApp({
          apiKey,
          embedded,
          shopOrigin
        })

        yield put(actions.startAppSuccess(getAppResponse))
      } else {
        const shopQuery: string | null = urlParams.get('shop')
        let nextAction: ServerResponse<AccessDeniedResponse> = {
          is_success: false,
          message_code: 'accessDenied',
          app: {
            app_id: '',
            login_url: '',
            embedded: false
          }
        }
        nextAction = Object.assign<
          AccessDeniedResponse,
          ServerResponse<{ app: GetAppResponse, user: GetUserResponse }>
        >(nextAction, getAppResponse)

        if (shopQuery) {
          const apiKey: string = nextAction?.app?.app_id ?? ''
          const embedded: boolean = nextAction?.app?.embedded ?? false

          const app = createApp({
            apiKey,
            embedded,
            shopOrigin: shopQuery
          })
          const redirect = haravanActions.Redirect.create(app)

          redirect.dispatch(
            haravanActions.Redirect.Action.REMOTE,
            nextAction.app.login_url
          )
        } else {
          window.location.href = nextAction.app.login_url
        }
      }
    }
  } catch (err) {
    yield put(actions.startAppFailure(err))
  }
}

export function* appSaga(): Generator {
  yield all([
    yield takeLatest(actions.startAppRequest.type, startAppRequest)
  ])
}