import * as React from 'react'
import {
  Store
} from '@store'
import {
  ModuleExport
} from '@commons/types'

const inject = (module: ModuleExport, store: Store): void => {
  if (module.key) {
    if (module.reducer) store.injectReducer({
      key: module.key,
      reducer: module.reducer
    })
    if (module.saga) store.injectSaga({
      key: module.key,
      saga: module.saga
    })
  }
}

export const Loadable = (factory: () => Promise<ModuleExport>) =>
  React.lazy(() => factory()
    .then((module: ModuleExport) => {
      inject(module, Store.getInstance())
      return factory()
    }))
