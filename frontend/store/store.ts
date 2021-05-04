import {
  configureStore,
  EnhancedStore
} from '@reduxjs/toolkit'
import {
  combineReducers
} from 'redux'
import createSagaMiddleware, {
  SagaMiddleware
} from 'redux-saga'
import {
  routerMiddleware
} from 'connected-react-router'
import {
  rootReducers,
  history
} from './root.reducers'
import {
  rootSaga
} from './root.saga'
import {
  sagaInjector,
  reducerInjector,
  reducerParams
} from './reducer.type'

export class Store {
  private static instance: Store
  private static sagaMiddleware: SagaMiddleware = createSagaMiddleware()
  public repository!: EnhancedStore
  public asyncReducers: reducerParams = {}
  public asyncSagas!: sagaInjector

  static createReducer(asyncReducers: reducerParams) {
    return combineReducers({
      ...rootReducers,
      ...asyncReducers
    })
  }

  private createSagaInjector(): Function {
    const injectedSagas = new Map()
    const isInjected = (key: string): boolean => injectedSagas.has(key)
    const injectSaga = ({ key, saga }: sagaInjector) => {
      if (isInjected(key)) return this
      const task = Store.sagaMiddleware.run(saga)
      injectedSagas.set(key, task)
      return this
    }

    return injectSaga
  }

  public static getInstance(): Store {
    if (!Store.instance) {
      Store.instance = new Store()
      Store.instance.repository = configureStore({
        reducer: this.createReducer({}),
        middleware: [
          routerMiddleware(history),
          Store.sagaMiddleware
        ],
        devTools: process.env.NODE_ENV === 'development',
        enhancers: []
      })
      Store.sagaMiddleware.run(rootSaga)
    }
    return Store.instance
  }

  public injectReducer({ key, reducer }: reducerInjector) {
    this.asyncReducers[key] = reducer
    this.repository.replaceReducer(Store.createReducer(this.asyncReducers))
    return this
  }

  public injectSaga = this.createSagaInjector()
}