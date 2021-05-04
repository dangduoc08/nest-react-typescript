import {
  Module
} from '@nestjs/common'
import {
  ShopSchema
} from './shop.schema'
import {
  ShopService
} from './shop.service'
import {
  SHOP_MODEL
} from './shop.constant'
import {
  ShopController
} from './shop.controller'
import {
  MongooseModule
} from '../mongoose'

@Module({
  imports: [
    MongooseModule.useSchema([
      { name: SHOP_MODEL, schema: ShopSchema }
    ])
  ],
  controllers: [
    ShopController
  ],
  providers: [
    ShopService
  ],
  exports: [
    ShopService
  ]
})
export class ShopModule { }
