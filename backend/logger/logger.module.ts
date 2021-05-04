import {
  Module,
  Global,
  DynamicModule
} from '@nestjs/common'
import {
  LoggerConfiguration,
  LoggerConfigurationExtender,
  LoggerService
} from './logger.interface'
import {
  LOGGER
} from './logger.constant'
import {
  StaticLogger
} from './static_logger.module'

@Global()
@Module({})
export class LoggerModule extends StaticLogger implements LoggerService {
  private static instance: LoggerModule
  public static register(config?: LoggerConfiguration): DynamicModule {
    if (!LoggerModule.instance) {
      LoggerModule.instance = new LoggerModule()
      LoggerModule.config = config || LoggerModule.config
    }
    const provider = {
      provide: LOGGER,
      useValue: LoggerModule.instance
    }
    return {
      module: LoggerModule,
      imports: [
        LoggerModule
      ],
      providers: [
        provider
      ],
      exports: [
        provider
      ]
    }
  }

  public info<T>(message: string, context?: string, data?: T): void {
    const loggerConfig: LoggerConfigurationExtender = {
      ...LoggerModule.config
    }
    if (arguments.length > 2) loggerConfig.showData = true
    LoggerModule.info(message, context, data, loggerConfig)
  }

  public warn<T>(message: string, context?: string, data?: T): void {
    const loggerConfig: LoggerConfigurationExtender = {
      ...LoggerModule.config
    }
    if (arguments.length > 2) loggerConfig.showData = true
    LoggerModule.warn(message, context, data, loggerConfig)
  }

  public error<T>(message: string, error: Error, context?: string, data?: T): void {
    const loggerConfig: LoggerConfigurationExtender = {
      ...LoggerModule.config
    }
    if (arguments.length > 3) loggerConfig.showData = true
    LoggerModule.error(message, error, context, data, loggerConfig)
  }
}
