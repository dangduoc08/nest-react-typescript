import * as React from 'react'
import {
  Switch,
  Route as RouteDOM,
  RouteComponentProps,
  withRouter
} from 'react-router-dom'
import {
  Route
} from '@commons/interfaces'
import {
  CONTAINER
} from '@commons/constants'
import App from '@containers/app'
import {
  rootRoute
} from './root.route'

function Root(props: RouteComponentProps) {
  const app = CONTAINER.APP
  const pathname: string = props?.location?.pathname ?? ''
  const route: Route = rootRoute.get(pathname) || {
    path: app.PATH,
    key: app.PATH,
    exact: app.EXACT,
    component: App
  }

  return (
    <React.Suspense fallback={null}>
      <Switch>
        <RouteDOM
          exact={route.exact}
          key={route.key}
          path={route.path}
          render={(props: RouteComponentProps) => <route.component {...props} />}
        />
      </Switch>
    </React.Suspense>
  )
}

export default withRouter(Root)