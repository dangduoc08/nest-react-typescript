import {
  Configuration
} from '../app.interface'

export const appConfig: Configuration = {
  app: {
    name: 'base-app',
    port: 3000,
    host: '0.0.0.0',
    domain: 'http://localhost:3000',
    tunnel: 'https://bfa54c00ba6f.ngrok.io',
    logo: 'logo.svg'
  },
  logger: {
    color: true,
    timestamp: true,
    multiline: true,
    depth: true,
    showHidden: true
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
  redis: {
    url: 'redis://127.0.0.1:6379/2',
    prefix: 'base_'
  },
  mongoose: {
    uris: 'mongodb://127.0.0.1:27017/base-app',
    prefix: 'base',
    debug: false,
    connectionOptions: {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      poolSize: 100
    }
  },
  cron: {
    sample: {
      pattern: '* * * * * *',
      active: false,
      overlap: 5,
      runOnInit: false
    }
  },
  session: {
    resave: false,
    saveUninitialized: false,
    secret: 'secret',
    cookie: {
      maxAge: 24 * 60 * 60 * 1000
    }
  },
  haravan: {
    issuerURL: 'https://accounts.haravan.com',
    apiURL: 'https://apis.haravan.com',
    webhookURL: 'https://webhook.haravan.com',
    webhookVerifyToken: '200894',
    appID: '09906e1867f4fdff2c01e7a21f6a0d84',
    appSecret: '71c3d76199c69d7acecb16d674896b507ba626616fbce1fc104c78e045295a4b',
    loginScope: 'openid profile email org userinfo',
    installScope: 'com.write_salechannels com.read_salechannels com.write_inventories com.read_inventories com.write_shippings com.read_shippings com.write_customers com.read_customers com.write_products com.read_products com.write_orders com.read_orders openid profile email org userinfo wh_api grant_service',
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
