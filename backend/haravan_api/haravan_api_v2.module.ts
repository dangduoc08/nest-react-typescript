import {
  Module,
  HttpModule
} from '@nestjs/common'
import {
  HaravanAPIV2Service
} from './haravan_api_v2.service'

@Module({
  providers: [
    HaravanAPIV2Service
  ],
  imports: [
    HttpModule
  ],
  exports: [
    HaravanAPIV2Service
  ]
})
export class HaravanAPIV2Module { }
