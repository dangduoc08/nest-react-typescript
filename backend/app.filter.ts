import * as fs from 'fs'
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  NotFoundException,
  HttpStatus
} from '@nestjs/common'
import {
  LoggerModule
} from './logger'
import {
  ServerResponse,
  ErrorResponse
} from './app.type'

@Catch()
export class ResponseErrorFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const req = ctx.getRequest()
    const res = ctx.getResponse()
    const code: number = exception?.getStatus()
    const statusCode: number = HttpStatus[code]
      ? HttpStatus[HttpStatus[code]]
      : HttpStatus.INTERNAL_SERVER_ERROR
    const errorMessage: string = exception?.message || 'Unknown error'

    const error: ServerResponse<ErrorResponse> = {
      is_success: false,
      message_code: 'requestError',
      error: {
        timestamp: new Date().toISOString(),
        path: req?.path,
        error_message: errorMessage
      }
    }

    res
      .status(statusCode)
      .json(error)
  }
}

@Catch(NotFoundException)
export class RenderTemplateFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const res = ctx.getResponse()

    const isDev: boolean = process.env.NODE_ENV === 'development'
    let fileSystem = fs
    let outputPath: string = 'frontend_build'
    const template: string = '/index.html'

    if (isDev) {
      const {
        devMiddleware,
        compiler
      } = require('./app.webpack')
      outputPath = compiler.outputPath
      fileSystem = devMiddleware.fileSystem
    }

    fileSystem.readFile(outputPath + template, (error: Error | null, file: Buffer) => {
      if (error) {
        LoggerModule.error(error.message, error, 'fsReadfile')
      } else {
        res.type('text/html').send(file.toString())
      }
    })
  }
}
