import {
  createSlice as createSLiceOriginal,
  SliceCaseReducers,
  CreateSliceOptions
} from '@reduxjs/toolkit'
import {
  rootStateKey
} from './reducer.type'

export const createSlice = <
  State,
  CaseReducers extends SliceCaseReducers<State>,
  Name extends rootStateKey
>(options: CreateSliceOptions<State, CaseReducers, Name>) =>
  createSLiceOriginal(options)