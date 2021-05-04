import {
  json,
  urlencoded,
  raw
} from 'body-parser'
import {
  Request,
  Response
} from 'express'
import {
  Injectable,
  NestMiddleware
} from '@nestjs/common'

@Injectable()
export class JSONBodyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    json()(req, res, next)
  }
}

@Injectable()
export class URLEncodedBodyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    urlencoded({ extended: false })(req, res, next)
  }
}

@Injectable()
export class RawBodyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    raw({ type: '*/*' })(req, res, next)
  }
}