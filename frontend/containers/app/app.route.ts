import {
  Loadable
} from '@components/loadable'
import {
  Route
} from '@commons/interfaces'
import {
  CONTAINER
} from '@commons/constants'

export const appRoute: Route[] = [
  {
    path: CONTAINER.DASHBOARD.PATH,
    key: CONTAINER.DASHBOARD.NAME,
    exact: CONTAINER.DASHBOARD.EXACT,
    component: Loadable(() => import('@containers/dashboard'))
  },
  {
    path: CONTAINER.TIKI.PATH,
    key: CONTAINER.TIKI.NAME,
    exact: CONTAINER.TIKI.EXACT,
    component: Loadable(() => import('@containers/tiki'))
  },
  {
    path: CONTAINER.SHOPEE.PATH,
    key: CONTAINER.SHOPEE.NAME,
    exact: CONTAINER.SHOPEE.EXACT,
    component: Loadable(() => import('@containers/shopee'))
  },
  {
    path: CONTAINER.LAZADA.PATH,
    key: CONTAINER.LAZADA.NAME,
    exact: CONTAINER.LAZADA.EXACT,
    component: Loadable(() => import('@containers/lazada'))
  },
  {
    path: CONTAINER.SETTINGS.PATH,
    key: CONTAINER.SETTINGS.NAME,
    exact: CONTAINER.SETTINGS.EXACT,
    component: Loadable(() => import('@containers/settings'))
  }
]
