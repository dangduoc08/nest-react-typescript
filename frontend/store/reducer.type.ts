import {
  Saga
} from 'redux-saga'
import {
  Reducer
} from '@reduxjs/toolkit'
import {
  LocationChangeAction
} from 'connected-react-router'
import {
  History
} from 'history'
import {
  RootState
} from '@commons/interfaces'

type requiredRootState = Required<RootState>

export type rootStateKey = keyof RootState

export type reducerParams = {
  [P in rootStateKey]?: Reducer<
    requiredRootState[P],
    LocationChangeAction<History>
  >
}

export type sagaInjector = {
  key: string
  saga: Saga
}

export type reducerInjector = {
  key: string
  reducer: Reducer
}