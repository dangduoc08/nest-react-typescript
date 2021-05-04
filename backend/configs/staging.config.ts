import {
  Configuration
} from '../app.interface'

export const appConfig: Configuration = {
  app: {
    name: 'base-app',
    port: 3000,
    host: '0.0.0.0',
    domain: 'http://localhost:3000',
    logo: 'logo.svg'
  },
  mongoose: {
    uris: 'mongodb://127.0.0.1:27017/base-app',
    prefix: 'base',
    debug: false,
    connectionOptions: {
      useNewUrlParser: true, // Must pass port to URI
      useCreateIndex: true, // To turn off Mongoose warning, use createIndex() instead ensureIndex()
      useUnifiedTopology: true, // New Mongo monitoring
      useFindAndModify: false,
      poolSize: 100
    }
  },
  logger: {
    color: true,
    timestamp: true,
    multiline: false,
    depth: true,
    showHidden: false
  },
  session: {
    resave: false,
    saveUninitialized: false,
    secret: 'secret',
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: 'none',
      secure: true
    }
  },
  rabbitMQ: {
    uris: 'amqp://guest:guest@127.0.0.1:5672/base-app',
    prefix: 'base',
    messageTtl: 2 * 24 * 60 * 60 * 1000,
    exchanges: {
      webhook: {
        name: 'webhook',
        type: 'direct',
        active: true,
        queues: {
          shop: {
            name: 'shop_realtime',
            routingKey: 'sync_shop_realtime',
            consumer: 1,
            active: true
          },
          user: {
            name: 'user_realtime',
            routingKey: 'sync_user_realtime',
            consumer: 1,
            active: true
          },
          app: {
            name: 'app_realtime',
            routingKey: 'sync_app_realtime',
            consumer: 1,
            active: true
          }
        }
      }
    }
  },
  cron: {
    sample: {
      pattern: '* * * * * *',
      active: false
    }
  },
  haravan: {
    issuerURL: 'https://accounts.haravan.com',
    apiURL: 'https://apis.haravan.com',
    webhookURL: 'https://webhook.haravan.com',
    webhookVerifyToken: '123456',
    appID: '09906e1867f4fdff2c01e7a21f6a0d84',
    appSecret: '71c3d76199c69d7acecb16d674896b507ba626616fbce1fc104c78e045295a4b',
    loginScope: 'openid profile email org userinfo',
    installScope: 'com.write_salechannels com.read_salechannels openid profile email org userinfo web.read_script_tags web.write_script_tags wh_api grant_service',
    embedded: false
  },
  uploader: {
    fileStorage: {
      tmp: {
        url: 'https://tmp.hara.vn',
        authorization: 'Basic cNevGHkJzbXrGKjmsJqVgGiYnADyqpNn'
      },
      static: {
        url: 'https://static.hara.vn',
        authorization: 'Basic 2661e0eda6b94a75a2405da4e20e26d4'
      }
    }
  }
}
