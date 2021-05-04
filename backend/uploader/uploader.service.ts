import {
  v4 as uuidV4
} from 'uuid'
import {
  Injectable,
  HttpService
} from '@nestjs/common'
import {
  FileStorageConfiguration,
  UploadMultipleFilesResponse,
  DeleteMultipleFilesResponse
} from './uploader.interface'
import {
  HelperService
} from '../helper'

@Injectable()
export class UploaderService {
  constructor(
    private readonly httpService: HttpService,
    private readonly helperService: HelperService
  ) { }

  public async uploadMultipleFiles(
    storage: FileStorageConfiguration[keyof FileStorageConfiguration],
    files: Express.Multer.File[]
  ): Promise<UploadMultipleFilesResponse[]> {
    const dataHelper = this.helperService.select('data')
    const headers = {
      Authorization: storage.authorization
    }
    const uploadResponse: UploadMultipleFilesResponse[] = []
    await files?.reduce(async (previousValue, currentValue) => {
      await previousValue

      const parsedFilename = (uuidV4() + '-' + dataHelper.handleFilename(escape(currentValue.originalname))).trim().toLowerCase()
      const apiURL = storage.url + '/' + parsedFilename

      try {
        const {
          data,
          config
        } = await this.httpService.post(apiURL, currentValue.buffer, { headers }).toPromise()
        if (data === config.headers?.['Content-Length']) {
          uploadResponse.push({
            fieldName: currentValue.fieldname,
            mimetype: currentValue.mimetype,
            originalFilename: currentValue.originalname,
            parsedFilename,
            url: config.url
          })
        } else {
          throw new Error(
            'Upload failed'
          )
        }
      } catch (err) {
        uploadResponse.push({
          fieldName: currentValue.fieldname,
          mimetype: currentValue.mimetype,
          originalFilename: currentValue.originalname,
          parsedFilename,
          errorMessage: err?.message ?? ''
        })
      }
    }, Promise.resolve())

    return uploadResponse
  }

  public async deleteMultipleFiles(
    storage: FileStorageConfiguration[keyof FileStorageConfiguration],
    filenames: string[]
  ): Promise<DeleteMultipleFilesResponse> {
    const headers = {
      Authorization: storage.authorization
    }
    const deleteResponse: DeleteMultipleFilesResponse = { success: [], failure: [] }
    await filenames?.reduce(async (previousValue, currentValue) => {
      await previousValue
      const apiURL = storage.url + '/' + currentValue

      try {
        await this.httpService.delete(apiURL, { headers }).toPromise()
        deleteResponse.success.push(currentValue)
      } catch (err) {
        deleteResponse.failure.push(currentValue)
      }
    }, Promise.resolve())

    return deleteResponse
  }
}