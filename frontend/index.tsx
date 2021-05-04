import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {
  Provider
} from 'react-redux'
import {
  ConnectedRouter
} from 'connected-react-router'
import CssBaseline from '@material-ui/core/CssBaseline'
import {
  ThemeProvider
} from '@material-ui/core/styles'
import {
  Store,
  history
} from '@store'
import {
  SnackbarProvider
} from 'notistack'
import Root from '@containers/root'
import {
  LOCALE
} from '@commons/constants'
import {
  i18n
} from './locales/i18n'
import {
  defaultTheme
} from './themes'

const store: Store = Store.getInstance()
i18n(LOCALE.VI.VALUE)

ReactDOM.render(
  <ThemeProvider theme={defaultTheme}>
    <CssBaseline />
    <Provider store={store.repository}>
      <ConnectedRouter history={history}>
        <SnackbarProvider
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          maxSnack={5}
        >
          <Root />
        </SnackbarProvider>
      </ConnectedRouter>
    </Provider>
  </ThemeProvider >,
  document.getElementById('root')
)