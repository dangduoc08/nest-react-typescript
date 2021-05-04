import {
  Loadable
} from '@components/loadable'
import {
  Route
} from '@commons/interfaces'
import {
  CONTAINER
} from '@commons/constants'

export const rootRoute = new Map<string, Route>()

rootRoute.set(CONTAINER.ERROR.PATH, {
  path: CONTAINER.ERROR.PATH,
  key: CONTAINER.ERROR.NAME,
  exact: CONTAINER.ERROR.EXACT,
  component: Loadable(() => import('@containers/error'))
})

rootRoute.set(CONTAINER.PERMISSION.PATH, {
  path: CONTAINER.PERMISSION.PATH,
  key: CONTAINER.PERMISSION.NAME,
  exact: CONTAINER.PERMISSION.EXACT,
  component: Loadable(() => import('@containers/permission'))
})
