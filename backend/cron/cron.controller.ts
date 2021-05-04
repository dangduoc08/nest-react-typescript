import {
  Controller,
  Inject,
  Get,
  HttpException
} from '@nestjs/common'
import {
  CRON_DEBUG
} from './cron.constant'
import {
  DebugData
} from './cron.interface'
import {
  LOGGER,
  LoggerService
} from '../logger'

@Controller()
export class CronController {
  constructor(
    @Inject(CRON_DEBUG) private readonly debugData: DebugData[],
    @Inject(LOGGER) private readonly loggerService: LoggerService
  ) { }

  @Get('/cron_stats.json')
  public getCronStats() {
    try {
      const cronStats = this.debugData?.map(cron => {
        const lastExecuteIn = cron.getLastExecuteIn()
        const parsedLastExecuteIn = lastExecuteIn
          ? `${lastExecuteIn / 1000} sec`
          : null

        return {
          cron_time: cron.cronTime,
          name: cron.name,
          bind_to: cron.bindTo,
          description: cron.description,
          is_locking: !cron.checkIsRunning(),
          is_run_on_init: cron.isRunOnInit,
          last_execute_at: cron.getLastExecuteAt() ?? null,
          last_execute_in: parsedLastExecuteIn,
          next_execute_at: cron.getNextExecuteAt(),
          current_overlap: cron.getCurrentOverlap(),
          max_overlap: cron.maxOverlap
        }
      })

      return {
        cron_stats: cronStats
      }
    } catch (err) {
      this.loggerService.error(err?.message, err, 'getCronStats')
      throw new HttpException(err?.message, err?.status)
    }
  }
}
