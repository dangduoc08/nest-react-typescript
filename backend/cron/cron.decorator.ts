import {
  CronJob
} from 'cron'
import {
  CronModule
} from './cron.module'
import {
  CRON_META
} from './cron.constant'
import {
  CronOption
} from './cron.interface'

const TaskScheduler = () =>
  function <T extends new (...agrs: any[]) => object>(Constructor: T) {
    return class extends Constructor {
      constructor(...args: any[]) {
        super(...args)
        const metaDataKeys = Reflect.getMetadataKeys(this) || []
        metaDataKeys.forEach((key: string) => {
          const pattern: string = Reflect.getMetadata(key, this)[CRON_META.PATTERN]
          const name: string = Reflect.getMetadata(key, this)[CRON_META.NAME]
          const active: boolean = Reflect.getMetadata(key, this)[CRON_META.ACTIVE]
          if (pattern && active) {
            const overlap: number = Reflect.getMetadata(key, this)[CRON_META.OVERLAP] ?? 1
            const runOnInit: boolean = Reflect.getMetadata(key, this)[CRON_META.RUN_ON_INIT] ?? false
            const pullOutIndex: number = Reflect.getMetadata(key, this)[CRON_META.PULL_OUT]
            const description: string = Reflect.getMetadata(key, this)[CRON_META.DESCRIPTION]
            let cronLocker: number = 0
            const dynamicArgs: Function[] = []
            let pullOutWrapper: Function = () => undefined


            const onTick = (): void => {
              dynamicArgs[pullOutIndex] = pullOutWrapper
              if (dynamicArgs[pullOutIndex]) {
                dynamicArgs[pullOutIndex] = dynamicArgs[pullOutIndex](new Date().getTime())
              }
              Reflect.getMetadata(key, this)[CRON_META.METHOD].apply(this, dynamicArgs)
            }

            const job = new CronJob({
              cronTime: pattern,
              onTick,
              start: true,
              runOnInit
            })

            job.addCallback(() => {
              ++cronLocker
              if (cronLocker >= overlap) {
                job.stop()
              }
            })

            let lastExecuteIn: null | number = null
            pullOutWrapper = (startTime: number): Function =>
              () => {
                lastExecuteIn = new Date().getTime() - startTime
                if (cronLocker >= overlap) {
                  --cronLocker
                  job.start()
                }
                return true
              }

            dynamicArgs[pullOutIndex] = pullOutWrapper

            CronModule.debugData.push({
              getNextExecuteAt: () => new Date(job.nextDate().toLocaleString()).toLocaleString('en-US', { hour12: false }),
              getLastExecuteAt: () => job.lastDate()?.toLocaleString('en-US', { hour12: false }),
              getLastExecuteIn: () => lastExecuteIn,
              checkIsRunning: () => job.running,
              getCurrentOverlap: () => cronLocker,
              maxOverlap: overlap,
              cronTime: pattern,
              bindTo: key,
              isRunOnInit: runOnInit,
              name,
              description
            })
          }
        })
      }
    }
  }

const CronRun = (cronOption: CronOption, description: string) =>
  function (target: object, key: string, descriptor: PropertyDescriptor) {
    const metaData = Reflect.getMetadata(key, target)
    const {
      pattern,
      active,
      overlap,
      runOnInit,
      name
    } = cronOption

    if (!metaData) {
      const value = {
        [CRON_META.PATTERN]: pattern,
        [CRON_META.ACTIVE]: active,
        [CRON_META.OVERLAP]: overlap,
        [CRON_META.RUN_ON_INIT]: runOnInit,
        [CRON_META.METHOD]: descriptor.value,
        [CRON_META.DESCRIPTION]: description,
        [CRON_META.NAME]: name
      }
      Reflect.defineMetadata(key, value, target)
    } else {
      metaData[CRON_META.PATTERN] = pattern
      metaData[CRON_META.ACTIVE] = active
      metaData[CRON_META.OVERLAP] = overlap
      metaData[CRON_META.RUN_ON_INIT] = runOnInit
      metaData[CRON_META.METHOD] = descriptor.value
      metaData[CRON_META.DESCRIPTION] = description
      metaData[CRON_META.NAME] = name
      Reflect.defineMetadata(key, metaData, target)
    }

    return descriptor
  }

const PullOut = () =>
  function (target: object, key: string, index: number) {
    const metaData = Reflect.getMetadata(key, target)
    if (!metaData) {
      const value = {
        [CRON_META.PULL_OUT]: index
      }
      Reflect.defineMetadata(key, value, target)
    } else {
      metaData[CRON_META.PULL_OUT] = index
      Reflect.defineMetadata(key, metaData, target)
    }
  }

export {
  TaskScheduler,
  CronRun,
  PullOut
}