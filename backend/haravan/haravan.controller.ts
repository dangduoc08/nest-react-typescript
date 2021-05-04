import {
  TokenSet,
  CallbackParamsType
} from 'openid-client'
import {
  Request,
  Response
} from 'express'
import {
  Get,
  Post,
  Query,
  Controller,
  Req,
  Inject,
  Redirect,
  HttpException,
  HttpStatus,
  Session,
  InternalServerErrorException,
  Res,
  Put,
  Delete,
  UnauthorizedException,
  NotFoundException,
  HttpService
} from '@nestjs/common'
import {
  ConfigService
} from '@nestjs/config'
import {
  HaravanConfiguration,
  HaravanTokenClaim,
  HaravanOpenID,
  GetAppResponse,
  GetUserResponse
} from './haravan.interface'
import {
  LogoutQueryDto
} from './haravan.dto'
import {
  ROLE,
  ROUTE_V1,
  PAGE,
  RESPONSE_MODE,
  RESPONSE_TYPE,
  OPEN_ID
} from './haravan.constant'
import {
  LOGGER,
  LoggerService
} from '../logger'
import {
  SessionService,
  SessionResponse
} from '../session'
import {
  ShopService,
  ShopQuery,
  ShopData,
  ShopEntity,
  ShopStatus
} from '../shop'
import {
  HaravanAPIV2Service
} from '../haravan_api'
import {
  UserService,
  UserData,
  UserQuery,
  UserStatus
} from '../user'
import {
  UserActivityLogService,
  UserActivityLogEvent,
  UserActivityLogResult
} from '../user_activity_log'
import {
  RedirectResponse,
  AppConfiguration
} from '../app.interface'
import {
  ServerResponse
} from '../app.type'
import {
  HelperService
} from '../helper'

@Controller()
export class HaravanController {
  private readonly appConfig: AppConfiguration | undefined
  private readonly haravanConfig: HaravanConfiguration | undefined
  private readonly loginRedirectURL: string
  private readonly logoutRedirectURL: string
  private readonly installRedirectURL: string
  private readonly redirectSuccessPage: RedirectResponse
  private readonly redirectPermissionPage: RedirectResponse
  private readonly redirectErrorPage: RedirectResponse
  private readonly redirectLogin: RedirectResponse
  private readonly redirectInstallApp: RedirectResponse
  private readonly loginURL: string
  private readonly installURL: string

  constructor(
    private readonly configService: ConfigService,
    private readonly sessionService: SessionService,
    private readonly shopService: ShopService,
    private readonly haravanAPIV2Service: HaravanAPIV2Service,
    private readonly userService: UserService,
    private readonly userActivityLogService: UserActivityLogService,
    private readonly helperService: HelperService,
    private readonly httpService: HttpService,
    @Inject(LOGGER) private readonly logger: LoggerService,
    @Inject(OPEN_ID) private readonly openID: HaravanOpenID
  ) {
    this.appConfig = this.configService.get('app')
    this.haravanConfig = this.configService.get('haravan')
    this.loginRedirectURL = this.appConfig?.domain + ROUTE_V1.LOGIN
    this.logoutRedirectURL = this.appConfig?.domain + ROUTE_V1.LOGOUT
    this.installRedirectURL = this.appConfig?.domain + ROUTE_V1.INSTALL
    this.logger.info(this.loginRedirectURL, 'LoginRedirectURL')
    this.logger.info(this.logoutRedirectURL, 'LogoutRedirectURL')
    this.logger.info(this.installRedirectURL, 'InstallRedirectURL')

    const commonAuthorizationParameters = {
      response_mode: RESPONSE_MODE,
      response_type: RESPONSE_TYPE,
      nonce: openID.nonce
    }

    this.loginURL = this.openID.client.authorizationUrl({
      scope: this.haravanConfig?.loginScope,
      redirect_uri: this.loginRedirectURL,
      ...commonAuthorizationParameters
    })
    this.installURL = this.openID.client.authorizationUrl({
      scope: this.haravanConfig?.installScope,
      redirect_uri: this.installRedirectURL,
      ...commonAuthorizationParameters
    })
    this.logger.info(this.loginURL, 'LoginURL')
    this.logger.info(this.installURL, 'InstallURL')

    this.redirectSuccessPage = {
      url: PAGE.APP,
      statusCode: HttpStatus.MOVED_PERMANENTLY
    }
    this.redirectPermissionPage = {
      url: PAGE.PERMISSION,
      statusCode: HttpStatus.MOVED_PERMANENTLY
    }
    this.redirectErrorPage = {
      url: PAGE.ERROR,
      statusCode: HttpStatus.MOVED_PERMANENTLY
    }
    this.redirectLogin = {
      url: this.loginURL,
      statusCode: HttpStatus.MOVED_PERMANENTLY
    }
    this.redirectInstallApp = {
      url: this.installURL,
      statusCode: HttpStatus.MOVED_PERMANENTLY
    }
  }

  @Get(ROUTE_V1.GET_APP)
  async getApp(
    @Session() session: Express.Session
  ): Promise<ServerResponse<{ app: GetAppResponse, user: GetUserResponse }>> {
    const fn = this.getApp.name
    try {
      const appName: string = this.appConfig?.name?.replace('-', ' ') ?? ''
      let logo: string = this.appConfig?.logo ?? ''
      logo = `/public/images/header/${logo}`
      const sessionData = this.sessionService.get<SessionResponse>(session)
      const {
        org_id,
        user_id,
        shop_extension,
        user_extension
      } = sessionData

      const {
        host,
        protocol
      } = new URL(shop_extension?.myharavan_domain ?? '')

      const appResponse: GetAppResponse = {
        app_id: this.haravanConfig?.appID ?? '',
        login_url: this.loginURL,
        logout_url: this.openID.issuer.metadata?.end_session_endpoint ?? '',
        embedded: this.haravanConfig?.embedded ?? false,
        app_name: appName,
        logo,
        org_id,
        myharavan_host: host,
        myharavan_protocol: protocol,
        shop_name: shop_extension?.name
      }

      const userResponse: GetUserResponse = {
        first_name: user_extension?.first_name,
        last_name: user_extension?.last_name,
        user_id
      }

      return {
        is_success: true,
        message_code: 'getAppSuccess',
        app: appResponse,
        user: userResponse
      }
    } catch (err) {
      this.logger.error(err.message, err, fn)
      throw new HttpException(err?.message, err?.status)
    }
  }

  @Post(ROUTE_V1.LOGIN)
  @Redirect('')
  async login(
    @Session() session: Express.Session,
    @Req() req: Request
  ): Promise<RedirectResponse> {
    try {
      const redirectInstallApp = Object.assign({}, this.redirectInstallApp)
      const params: CallbackParamsType = this.openID.client.callbackParams(req)

      const tokenSet: TokenSet = await this.openID.client.callback(
        this.loginRedirectURL,
        params,
        {
          nonce: this.openID.nonce
        }
      )
      const tokenClaims: HaravanTokenClaim = tokenSet.claims()
      const orgID: string = tokenClaims?.orgid ?? ''
      const role: Array<string> = tokenClaims?.role ?? []
      const isAdmin: boolean = role.includes(ROLE.ADMIN)
      const sid: string = tokenClaims?.sid ?? ''
      const sub: string = tokenClaims?.sub ?? ''
      const sessionCreateData = {
        org_id: +orgID,
        sid,
        access_token: tokenSet.access_token,
        role,
        user_extension: {},
        shop_extension: {},
        extension: {}
      }

      if (tokenSet.expires_at) {
        const timeHelper = this.helperService.select('time')
        sessionCreateData['expires_at'] = timeHelper.parse(tokenSet.expires_at, 'seconds')
      }

      const shopQueryData: ShopQuery = {
        _id: +orgID,
        'extension.status': ShopStatus.Active
      }
      const shopDoc: ShopEntity | null = await this.shopService.getOne(
        shopQueryData
      )

      const tokenType: string = shopDoc?.extension?.haravan_authorization_v2?.token_type ?? 'Bearer'
      const haravanAccessToken: string = shopDoc?.extension?.haravan_authorization_v2?.access_token ?? ''

      if (!haravanAccessToken) {
        if (!isAdmin) {
          return this.redirectPermissionPage
        }
        if (orgID) {
          redirectInstallApp.url += `&orgid=${orgID}`
        }
        return redirectInstallApp
      }

      const bearerAccessToken = `${tokenType} ${haravanAccessToken}`
      sessionCreateData.extension['haravan_access_token_v2'] = bearerAccessToken
      const haravanAPIV2 = this.haravanAPIV2Service.new(bearerAccessToken)
      if (!haravanAPIV2) {
        throw new InternalServerErrorException('Could not create Haravan API V2 instance')
      }

      try {
        const userAPIService = haravanAPIV2.select('user')
        const { data: { user } } = await userAPIService.getUser({ userID: sub })

        if (user) {
          const {
            id,
            email,
            bio,
            account_owner,
            user_type,
            receive_announcements,
            url,
            im,
            first_name,
            last_name,
            phone,
            permissions
          } = user

          const userQuery: UserQuery = {
            _id: id,
            'extension.status': UserStatus.Active
          }
          const userUpdate: UserData = {
            org_id: +orgID,
            email: email,
            first_name,
            last_name,
            bio,
            phone,
            account_owner: account_owner,
            user_type: user_type,
            receive_announcements: +receive_announcements,
            url: url,
            im: im,
            permissions
          }

          const newUserDoc = await this.userService.upsertOne(
            userQuery,
            userUpdate
          )

          if (newUserDoc) {
            const newUserActivityLogData = {
              first_name,
              last_name,
              org_id: +orgID,
              user_id: +newUserDoc._id,
              event_id: UserActivityLogEvent.UserLogin,
              result_id: UserActivityLogResult.Success
            }
            await this.userActivityLogService.createOne(newUserActivityLogData)
          }

          sessionCreateData['user_id'] = newUserDoc?._id
          sessionCreateData.user_extension['first_name'] = first_name?.trim()
          sessionCreateData.user_extension['last_name'] = last_name?.trim()
        }
      } catch (err) {
        this.logger.error(err.message, err, 'loginHaravan -> getUserApi')
      }

      try {
        const shopAPIService = haravanAPIV2.select('shop')
        const { data } = await shopAPIService.getShop()

        if (data.shop) {
          const {
            name,
            myharavan_domain
          } = data.shop
          sessionCreateData.shop_extension['name'] = name
          if (myharavan_domain) {
            sessionCreateData.shop_extension['myharavan_domain'] = myharavan_domain
          }
          this.sessionService.set(session, sessionCreateData)

          return this.redirectSuccessPage
        } else {

          return this.redirectErrorPage
        }
      } catch (err) {
        this.logger.error(err.message, err, 'loginHaravan -> getShopApi')
        if (!isAdmin) {

          return this.redirectPermissionPage
        }
        if (orgID) {
          redirectInstallApp.url += `&orgid=${orgID}`
        }

        return redirectInstallApp
      }
    } catch (err) {
      this.logger.error(err.message, err, 'loginHaravan')

      return this.redirectErrorPage
    }
  }

  @Post(ROUTE_V1.INSTALL)
  @Redirect('')
  async install(
    @Req() req: Request,
    @Session() session: Express.Session
  ): Promise<RedirectResponse> {
    try {
      const redirectLogin = Object.assign({}, this.redirectLogin)
      const params = this.openID.client.callbackParams(req)
      const tokenSet: TokenSet = await this.openID.client.callback(
        this.installRedirectURL,
        params,
        {
          nonce: this.openID.nonce
        }
      )
      const idToken: string = tokenSet?.id_token ?? ''
      const tokenType: string = tokenSet.token_type ?? ''
      const haravanAccessToken: string = tokenSet?.access_token ?? ''
      const expiresAt: number | undefined = tokenSet?.expires_at
      const scope = tokenSet?.scope ?? ''
      const sessionState = tokenSet?.session_state ?? ''
      const tokenClaims: HaravanTokenClaim = tokenSet.claims()
      const orgID: string = tokenClaims?.orgid ?? ''
      const roles: string[] = tokenClaims?.role ?? []
      const isAdmin: boolean = roles.includes(ROLE.ADMIN)
      if (!isAdmin) {
        return this.redirectPermissionPage
      }

      if (haravanAccessToken) {
        const bearerAccessToken = `${tokenType} ${haravanAccessToken}`
        const haravanAPIV2 = this.haravanAPIV2Service.new(bearerAccessToken)
        if (!haravanAPIV2) {
          throw new InternalServerErrorException('Could not create Haravan API V2 instance')
        }

        try {
          const webhookAPIService = haravanAPIV2.select('webhook')
          const { data } = await webhookAPIService.subcribeWebhook()
          if (data.error) {
            throw new InternalServerErrorException(data.error_Code)
          }
          this.logger.info(data.message, 'SubscribeWebhook')
        } catch (err) {
          this.logger.error(err.message, err, 'installApp -> subscribeWebhook')
          return this.redirectErrorPage
        }

        try {
          const shopAPIService = haravanAPIV2.select('shop')
          const { data: { shop } } = await shopAPIService.getShop()
          const {
            address1,
            city,
            country,
            country_code,
            currency,
            country_name,
            customer_email,
            domain,
            email,
            google_apps_domain,
            google_apps_login_enabled,
            latitude,
            longitude,
            money_format,
            money_with_currency_format,
            myharavan_domain,
            name,
            plan_name,
            display_plan_name,
            password_enabled,
            phone,
            province,
            province_code,
            shop_owner,
            tax_shipping,
            taxes_included,
            county_taxes,
            timezone,
            zip,
            source,
            has_storefront,
            shop_plan_id,
            inventory_method,
            fullname_checkout_behavior,
            email_checkout_behavior,
            address_checkout_behavior,
            district_checkout_behavior,
            ward_checkout_behavior,
            created_at
          } = shop

          const shopQueryData: ShopQuery = {
            _id: +orgID
          }

          const shopUpdateData: ShopData = {
            extension: {
              haravan_authorization_v2: {
                id_token: idToken,
                expires_at: expiresAt ?? 0,
                scope,
                session_state: sessionState,
                access_token: haravanAccessToken,
                token_type: tokenType
              }
            },
            address1,
            city,
            country,
            country_code,
            currency,
            country_name,
            customer_email,
            domain,
            email,
            google_apps_domain,
            google_apps_login_enabled,
            latitude,
            longitude,
            money_format,
            money_with_currency_format,
            myharavan_domain,
            name,
            plan_name,
            display_plan_name,
            password_enabled,
            phone,
            province,
            province_code,
            shop_owner,
            tax_shipping,
            taxes_included,
            county_taxes,
            timezone,
            zip,
            source,
            has_storefront,
            shop_plan_id,
            inventory_method,
            fullname_checkout_behavior,
            email_checkout_behavior,
            address_checkout_behavior,
            district_checkout_behavior,
            ward_checkout_behavior,
            created_at,
            public: shop.public
          }

          await this.shopService.upsertOne(
            shopQueryData,
            shopUpdateData
          )
        } catch (err) {
          this.logger.error(err.message, err, 'loginHaravan -> getShopApi -> upsertShop')
          return this.redirectErrorPage
        }

        const sess = this.sessionService.get<SessionResponse>(session)
        const hasSession: boolean = !!sess && Object.keys(sess).length > 0
        if (!hasSession) {
          if (orgID) {
            redirectLogin.url += `&orgid=${orgID}`
          }
          return redirectLogin
        }

        return this.redirectSuccessPage
      } else {
        return this.redirectErrorPage
      }
    } catch (err) {
      this.logger.error(err.message, err, 'installApp')
      return this.redirectErrorPage
    }
  }

  @Get(ROUTE_V1.LOGOUT)
  public async logout(
    @Query() query: LogoutQueryDto
  ): Promise<void> {
    try {
      const {
        sid
      } = query
      await this.sessionService.deleteMany({
        sid
      })
    } catch (err) {
      this.logger.error(err.message, err, 'logoutHaravan')
      throw new HttpException(err?.message, err?.status)
    }
  }

  @Get(ROUTE_V1.HARAVAN_API)
  public async getHaravanAPI(
    @Session() session: Express.Session,
    @Req() req: Request,
    @Res() res: Response
  ) {
    return await this.callHaravanAPI(session, req, res, 'get')
  }

  @Post(ROUTE_V1.HARAVAN_API)
  public async postHaravanAPI(
    @Session() session: Express.Session,
    @Req() req: Request,
    @Res() res: Response
  ) {
    return await this.callHaravanAPI(session, req, res, 'post')
  }

  @Put(ROUTE_V1.HARAVAN_API)
  public async putHaravanAPI(
    @Session() session: Express.Session,
    @Req() req: Request,
    @Res() res: Response
  ) {
    return await this.callHaravanAPI(session, req, res, 'put')
  }

  @Delete(ROUTE_V1.HARAVAN_API)
  public async deleteHaravanAPI(
    @Session() session: Express.Session,
    @Req() req: Request,
    @Res() res: Response
  ) {
    return await this.callHaravanAPI(session, req, res, 'delete')
  }


  private async callHaravanAPI(
    session: Express.Session,
    req: Request,
    res: Response,
    method: string
  ) {
    try {
      if (!this.haravanConfig) {
        throw new InternalServerErrorException(
          'Require HaravanConfiguration'
        )
      }
      const {
        apiURL
      } = this.haravanConfig

      const sess = this.sessionService.get<SessionResponse>(session)
      if (!sess) {
        throw new UnauthorizedException(
          'Login to Haravan account to continue'
        )
      }

      const {
        org_id: orgID
      } = sess
      if (!orgID) {
        throw new UnauthorizedException(
          'Cannot find org_id in session'
        )
      }

      const shopDoc = await this.shopService.getOne({
        _id: orgID,
        'extension.status': ShopStatus.Active
      })

      if (!shopDoc) {
        throw new NotFoundException(
          'Cannot find this Haravan seller'
        )
      }

      if (
        !shopDoc.extension.haravan_authorization_v2?.token_type
        || !shopDoc.extension.haravan_authorization_v2?.access_token
      ) {
        throw new UnauthorizedException(
          'Install app to continue'
        )
      }
      const {
        token_type: tokenType,
        access_token: accessToken
      } = shopDoc.extension.haravan_authorization_v2

      const api = apiURL + req.originalUrl
      const bearerToken = `${tokenType} ${accessToken}`
      const headers = { Authorization: bearerToken }
      const args = []

      switch (method) {
        case 'get':
        case 'delete':
          args.push({ headers })
          break
        case 'post':
        case 'put':
          args.push({ ...req.body }, { headers })
          break
        default:
          break
      }

      const {
        headers: responseHeader,
        data: responseData
      } = await this.httpService?.[method](api, ...args).toPromise()
      delete responseHeader['transfer-encoding']

      res.header(responseHeader).json(responseData)
    } catch (err) {
      const response = err?.response ?? {}
      const {
        status = HttpStatus.INTERNAL_SERVER_ERROR,
        headers: responseHeader = {},
        data: responseData = { error_message: err?.message ?? '' }
      } = response
      delete responseHeader['transfer-encoding']

      res.status(status).header(responseHeader).json(responseData)
    }
  }
}
