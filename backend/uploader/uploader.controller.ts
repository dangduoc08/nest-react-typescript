import {
  Controller,
  Post,
  Put,
  UseInterceptors,
  UploadedFiles,
  Param,
  InternalServerErrorException,
  HttpException,
  Inject,
  Session,
  UnauthorizedException,
  UnprocessableEntityException,
  Body
} from '@nestjs/common'
import {
  ConfigService
} from '@nestjs/config'
import {
  AnyFilesInterceptor
} from '@nestjs/platform-express'
import {
  UploaderConfiguration,
  DeleteMultipleFilesResponse
} from './uploader.interface'
import {
  ROUTE,
  MAX_FILE_SIZE,
  FILE_EXTENSION_WHITELIST
} from './uploader.constant'
import {
  UploadFilesParamDTO,
  DeleteFilesParamDTO,
  DeleteFilesBodyDTO
} from './uploader.dto'
import {
  UploaderService
} from './uploader.service'
import {
  SessionService,
  SessionResponse
} from '../session'
import {
  LOGGER,
  LoggerService
} from '../logger'
import {
  ServerResponse
} from '../app.type'

@Controller()
export class UploaderController {
  private readonly uploaderConfiguration: UploaderConfiguration | undefined
  constructor(
    private readonly configService: ConfigService,
    private readonly sessionService: SessionService,
    private readonly uploaderService: UploaderService,
    @Inject(LOGGER) private readonly loggerService: LoggerService
  ) {
    this.uploaderConfiguration = this.configService.get('uploader')
  }

  @Post(ROUTE.UPLOAD_FILES)
  @UseInterceptors(AnyFilesInterceptor({
    limits: {
      fileSize: MAX_FILE_SIZE
    },
    fileFilter: (req: Express.Request, file: Express.Multer.File, cb) => {
      const fileExtension = file.originalname.split('.').pop() ?? ''
      if (!FILE_EXTENSION_WHITELIST.includes(fileExtension)) {
        cb(new UnprocessableEntityException('Invalid file type'), false)
      } else {
        cb(null, true)
      }
    }
  }))
  async uploadFiles(
    @Param() param: UploadFilesParamDTO,
    @Session() session: Express.Session,
    @UploadedFiles() files: Express.Multer.File[]
  ): Promise<ServerResponse<{ files: ({ field_name?: string, original_filename?: string, parsed_filename?: string, mimetype?: string, url?: string, error_message?: string } | undefined)[] }>> {
    const fn = this.uploadFiles.name
    try {
      if (!this.uploaderConfiguration) {
        throw new InternalServerErrorException(
          'Require UploaderConfiguration'
        )
      }

      const sess = this.sessionService.get<SessionResponse>(session)
      if (!sess.org_id) {
        throw new UnauthorizedException(
          'Cannot find org_id in session'
        )
      }
      const {
        org_id: folder
      } = sess

      const storage = this.uploaderConfiguration.fileStorage[param.storage]
      const url = storage.url + '/' + folder
      const uploadedFiles = await this.uploaderService.uploadMultipleFiles({ ...storage, url }, files)

      return {
        is_success: true,
        files: uploadedFiles.map(uploadedFile => ({
          field_name: uploadedFile?.fieldName,
          mimetype: uploadedFile?.mimetype,
          original_filename: uploadedFile?.originalFilename,
          parsed_filename: uploadedFile?.parsedFilename,
          url: uploadedFile?.url,
          error_message: uploadedFile?.errorMessage
        }))
      }
    } catch (err) {
      this.loggerService.error(err.message, err, fn)
      throw new HttpException(err?.message, err?.status)
    }
  }

  @Put(ROUTE.DELETE_FILES)
  public async deleteFiles(
    @Param() param: DeleteFilesParamDTO,
    @Session() session: Express.Session,
    @Body() body: DeleteFilesBodyDTO
  ): Promise<ServerResponse<DeleteMultipleFilesResponse>> {
    const fn = this.deleteFiles.name
    try {
      if (!this.uploaderConfiguration) {
        throw new InternalServerErrorException(
          'Require UploaderConfiguration'
        )
      }

      const sess = this.sessionService.get<SessionResponse>(session)
      if (!sess.org_id) {
        throw new UnauthorizedException(
          'Cannot find org_id in session'
        )
      }
      const {
        org_id: folder
      } = sess

      const storage = this.uploaderConfiguration.fileStorage[param.storage]
      const url = storage.url + '/' + folder
      const deleteMultipleFilesResponse = await this.uploaderService.deleteMultipleFiles({ ...storage, url }, body.filenames)

      return {
        is_success: true,
        ...deleteMultipleFilesResponse
      }
    } catch (err) {
      this.loggerService.error(err.message, err, fn)
      throw new HttpException(err?.message, err?.status)
    }
  }
}