import {
  DynamicModule
} from '@nestjs/common'
import {
  DebugData
} from './cron.interface'
import {
  CronConfiguration
} from './cron.type'
import {
  CronController
} from './cron.controller'
import {
  CRON_DEBUG
} from './cron.constant'

export class CronModule {
  public static cronConfiguration: CronConfiguration<string>
  public static debugData: DebugData[] = []

  public static register(cronConfiguration: CronConfiguration<string>): DynamicModule {
    if (!CronModule.cronConfiguration) {
      CronModule.cronConfiguration = cronConfiguration
    }
    return {
      module: CronModule,
      controllers: [
        CronController
      ],
      providers: [
        {
          provide: CRON_DEBUG,
          useValue: CronModule.debugData
        }
      ]
    }
  }
}