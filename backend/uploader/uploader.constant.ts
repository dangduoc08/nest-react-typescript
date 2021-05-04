export const MAX_FILE_SIZE = 2097152 // 2Mb
export const ROUTE = {
  UPLOAD_FILES: 'files/:storage/upload',
  DELETE_FILES: 'files/:storage/delete'
}
export const FILE_EXTENSION_WHITELIST = [
  'jpeg',
  'png',
  'jpg',
  'xlsx',
  'pdf',
  'txt'
]