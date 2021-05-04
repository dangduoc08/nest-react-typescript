export interface FileStorageConfiguration {
  [key: string]: {
    url: string
    authorization: string
  }
}

export interface UploaderConfiguration {
  fileStorage: FileStorageConfiguration
}

export interface UploadMultipleFilesResponse {
  fieldName: string
  originalFilename: string
  parsedFilename: string
  mimetype: string
  url?: string
  errorMessage?: string
}

export interface DeleteMultipleFilesResponse {
  success: Array<string>
  failure: Array<string>
}