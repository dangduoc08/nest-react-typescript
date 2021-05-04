import App from './app.container'
import {
  reducer,
  key
} from './app.slice'
import {
  appSaga as saga
} from './app.saga'

export {
  key,
  reducer,
  saga
}
export default App