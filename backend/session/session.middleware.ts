import connectMongo from 'connect-mongo'
import session from 'express-session'
import {
  Request,
  Response,
  RequestHandler,
  NextFunction
} from 'express'
import {
  SessionOptions
} from 'express-session'
import {
  connection
} from 'mongoose'
import {
  Injectable,
  NestMiddleware
} from '@nestjs/common'
import {
  ConfigService
} from '@nestjs/config'
import {
  SESSION_MODEL
} from './session.constant'
import {
  MongooseConfiguration
} from '../mongoose'

const MongoStore: connectMongo.MongoStoreFactory = connectMongo(session)

@Injectable()
export class SessionAdditionMiddleware implements NestMiddleware {
  private appConfig: { name: string } | undefined
  private sessionConfig: SessionOptions | undefined
  private mongooseConfig: MongooseConfiguration | undefined

  private sessionHandler!: RequestHandler

  constructor(
    private configService: ConfigService
  ) {
    this.appConfig = this.configService.get('app')
    this.sessionConfig = this.configService.get('session')
    this.mongooseConfig = this.configService.get('mongoose')
    const collection: string = this.mongooseConfig?.prefix
      ? this.mongooseConfig.prefix + '_' + SESSION_MODEL
      : SESSION_MODEL

    this.sessionHandler = session({
      name: this.appConfig?.name ?? '',
      resave: this.sessionConfig?.resave ?? false,
      saveUninitialized: this.sessionConfig?.resave ?? false,
      secret: this.sessionConfig?.secret ?? '',
      cookie: this.sessionConfig?.cookie,
      store: new MongoStore({
        mongooseConnection: connection,
        stringify: false,
        collection
      })
    })
  }

  use(req: Request, res: Response, next: NextFunction) {
    this.sessionHandler(req, res, next)
  }
}
