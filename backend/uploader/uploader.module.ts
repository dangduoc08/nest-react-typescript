import {
  Module,
  HttpModule
} from '@nestjs/common'
import {
  UploaderController
} from './uploader.controller'
import {
  UploaderService
} from './uploader.service'

@Module({
  imports: [
    HttpModule
  ],
  controllers: [
    UploaderController
  ],
  providers: [
    UploaderService
  ]
})
export class UploaderModule { }