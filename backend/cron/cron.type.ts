import {
  CronOption
} from './cron.interface'

export type CronConfiguration<T extends string> = {
  [K in T]: CronOption
}