import {
  Time,
  Data,
  Query
} from './util'

export type Util = 'time' | 'data' | 'query'

export type UtilInstance<T extends Util>
  = T extends 'time'
  ? Time
  : T extends 'data'
  ? Data
  : T extends 'query'
  ? Query
  : undefined
