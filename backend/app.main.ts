import {
  resolve
} from 'path'
import {
  NestFactory
} from '@nestjs/core'
import {
  NestExpressApplication
} from '@nestjs/platform-express'
import {
  AppModuleFactory
} from './app.module'
import {
  LoggerModule
} from './logger'
import {
  RenderTemplateFilter,
  ResponseErrorFilter
} from './app.filter'
import {
  AppValidationPipe
} from './app.pipe'
import {
  AppConfig
} from './app.config'

export async function runApp(): Promise<NestExpressApplication | void> {
  try {
    const {
      env,
      file,
      appConfig
    } = AppConfig.load()
    LoggerModule.info(env, 'NODE_ENV', null, appConfig.logger)
    LoggerModule.info(file, 'Configuration', null, appConfig.logger)
    const isDev: boolean = env === 'development'

    const {
      port,
      host = ''
    } = appConfig.app

    const app: NestExpressApplication = await NestFactory.create<NestExpressApplication>(
      new AppModuleFactory(appConfig),
      {
        logger: false,
        bodyParser: false
      }
    )

    app.enableCors({
      origin: false
    })
    app.set('trust proxy', 1)

    const globalFilters = [
      new ResponseErrorFilter()
    ]

    if (isDev) {
      const morgan = require('morgan')
      const argvs = require('minimist')(process.argv.slice(2))
      const isBundle: boolean = argvs?.bundle !== 'false'
      const devMiddlewares = [
        morgan('dev')
      ]
      if (isBundle) {
        devMiddlewares.push(
          require('./app.webpack').devMiddleware,
          require('./app.webpack').hotMiddleware
        )
        globalFilters.push(
          new RenderTemplateFilter()
        )
      }
      app.use(...devMiddlewares)
    } else {
      globalFilters.push(
        new RenderTemplateFilter()
      )
    }

    app.useGlobalFilters(...globalFilters)

    const PUBLIC_FOLDER = [
      {
        PATH: resolve(process.cwd() + '/public'),
        PREFIX: '/public/'
      },
      {
        PATH: 'frontend_build',
        PREFIX: '/public/'
      }
    ]

    PUBLIC_FOLDER.forEach(folder =>
      app.useStaticAssets(folder.PATH, { prefix: folder.PREFIX }))

    app.useGlobalPipes(new AppValidationPipe())
    await app.listen(port, host)
    return app
  } catch (err) {
    LoggerModule.error(err.message, err, 'runApp')
  }
}

runApp()