import {
  Injectable,
  NestMiddleware,
  Inject,
  HttpStatus
} from '@nestjs/common'
import {
  ConfigService
} from '@nestjs/config'
import {
  Request,
  Response,
  NextFunction
} from 'express'
import {
  HaravanConfiguration,
  HaravanOpenID,
  AccessDeniedResponse
} from './haravan.interface'
import {
  ROUTE_V1,
  OPEN_ID,
  RESPONSE_MODE,
  RESPONSE_TYPE
} from './haravan.constant'
import {
  ServerResponse
} from '../app.type'

@Injectable()
export class SessionAuthenticationMiddleware implements NestMiddleware {
  private appConfig: { name: string, favicon: string, logo: string, domain: string } | undefined
  private haravanConfig: HaravanConfiguration | undefined

  constructor(
    private configService: ConfigService,
    @Inject(OPEN_ID) readonly openID: HaravanOpenID
  ) {
    this.appConfig = this.configService.get('app')
    this.haravanConfig = this.configService.get('haravan')
  }

  use(req: Request, res: Response, next: NextFunction) {
    if (req.session && req.session.org_id) {
      next()
    } else {
      if (this.haravanConfig && this.appConfig) {
        const {
          appID,
          loginScope,
          embedded
        } = this.haravanConfig

        const {
          domain
        } = this.appConfig

        const loginURL = this.openID.client.authorizationUrl({
          scope: loginScope,
          redirect_uri: domain + ROUTE_V1.LOGIN,
          response_mode: RESPONSE_MODE,
          response_type: RESPONSE_TYPE,
          nonce: this.openID.nonce
        })

        const dataResponse: ServerResponse<{ app: AccessDeniedResponse }> = {
          is_success: false,
          message_code: 'accessDenied',
          app: {
            app_id: appID,
            login_url: loginURL,
            embedded: !!embedded
          }
        }

        res.status(HttpStatus.UNAUTHORIZED).json(dataResponse)
      }
    }
  }
}