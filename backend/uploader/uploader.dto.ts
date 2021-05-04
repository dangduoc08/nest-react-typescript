import {
  IsIn,
  IsArray
} from 'class-validator'
import {
  FileStorageConfiguration
} from './uploader.interface'
import {
  AppConfig
} from '../app.config'

const fileStorageConfig = AppConfig
  .load()
  .uploader<FileStorageConfiguration>('fileStorage')
const validStorages = Object.keys(fileStorageConfig)

export abstract class UploadFilesParamDTO {
  @IsIn(validStorages, {
    message: 'Invalid URL'
  })
  abstract storage: string
}

export abstract class DeleteFilesParamDTO {
  @IsIn(validStorages, {
    message: 'Invalid URL'
  })
  abstract storage: string
}

export abstract class DeleteFilesBodyDTO {
  @IsArray()
  abstract filenames: Array<string>
}