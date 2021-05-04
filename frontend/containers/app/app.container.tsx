import * as React from 'react'
import Container from '@material-ui/core/Container'
import Box from '@material-ui/core/Box'
import Hidden from '@material-ui/core/Hidden'
import {
  connect
} from 'react-redux'
import {
  Switch,
  Route as RouteDOM,
  RouteComponentProps
} from 'react-router-dom'
import {
  Route,
  RootState
} from '@commons/interfaces'
import {
  Store
} from '@store'
import {
  AppState
} from './app.interface'
import {
  actions
} from './app.slice'
import {
  appRoute
} from './app.route'
import {
  Header,
  Navigator,
  ProgressBar,
  Notification
} from './components'
import {
  key,
  reducer
} from './app.slice'
import {
  appSaga
} from './app.saga'

Store.getInstance()
  .injectReducer({ key, reducer })
  .injectSaga({ key, saga: appSaga })

interface AppProp extends AppState {
  startApp: Function
}

class App extends React.PureComponent<AppProp> {
  constructor(props: AppProp) {
    super(props)
  }

  componentDidMount() {
    this.props?.startApp()
  }

  renderAppRoute = (route: Route) =>
    <RouteDOM
      exact={route.exact}
      key={route.key}
      path={route.path}
      render={(props: RouteComponentProps) => <route.component {...props} />}
    />

  render() {
    const {
      shop,
      user
    } = this.props
    return (
      <Box
        display="flex"
        style={{ marginTop: 56 }}
      >
        <Notification />
        <ProgressBar />
        <Header
          user={user}
          shop={shop}
        />
        <Hidden only={['xs']}>
          <Navigator />
        </Hidden>
        <Container style={{ padding: 0 }}>
          <React.Suspense fallback={null}>
            <Switch>
              {appRoute.map(this.renderAppRoute)}
            </Switch>
          </React.Suspense>
        </Container>
      </Box>
    )
  }
}

const mapStateToProps = (state: RootState) => {
  const appState: AppState = state.app
  return ({
    ...appState
  })
}

const mapDispatchToProps = (dispatch: Function) => ({
  startApp: () =>
    dispatch(actions.startAppRequest())
})

export default connect(mapStateToProps, mapDispatchToProps)(App)