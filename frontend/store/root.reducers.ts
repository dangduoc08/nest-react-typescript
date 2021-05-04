import {
  connectRouter
} from 'connected-react-router'
import {
  createBrowserHistory,
  History
} from 'history'
import {
  reducerParams
} from './reducer.type'

export const history: History = createBrowserHistory()

export const rootReducers: reducerParams = {
  router: connectRouter(history)
}