import {
  Controller,
  Inject
} from '@nestjs/common'
import {
  TaskScheduler,
  PullOut,
  CronRun
} from '../cron'
import {
  LOGGER,
  LoggerService
} from '../logger'
import {
  AppConfig
} from '../app.config'
import {
  HelperService
} from '../helper'

const appConfig = AppConfig.load()

@Controller()
@TaskScheduler()
export class SampleController {
  constructor(
    private readonly helperService: HelperService,
    @Inject(LOGGER) private readonly loggerService: LoggerService
  ) { }

  @CronRun(
    appConfig.cron('sample'),
    'Demo run cron job 1'
  )
  public async runSample1(
    @PullOut() pullOut: Function
  ) {
    await this.helperService.select('time').idle(5)
    this.loggerService.info('This text prove cron 1 ran', 'runSample')
    if (pullOut) {
      pullOut()
    }
  }

  @CronRun(
    appConfig.cron('sample'),
    'Demo run cron job 2'
  )
  public async runSample2(
    @PullOut() pullOut: Function
  ) {
    await this.helperService.select('time').idle(60)
    this.loggerService.warn('This text prove cron 2 ran', 'runSample')
    if (pullOut) {
      pullOut()
    }
  }

}