export class Data {
  private static instance: Data
  private static whiteListObj = [
    Date
  ]

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() { }

  public static getInstance(): Data {
    if (!Data.instance) {
      Data.instance = new Data()
    }
    return Data.instance
  }

  private validateJSONString = (str: string) => {
    try {
      const obj = JSON.parse(str)
      if (typeof obj !== 'object') {
        return false
      }
      return obj
    } catch {
      return false
    }
  }

  private closeTag = (tag: string) =>
    tag.replace('<', '</')

  public convertJSONToXML = (obj: Record<string, unknown>, preXML = '') => {
    let xmlObj = {}

    for (const tag in obj) {
      const value = obj[tag]
      const valueType = typeof value

      if (valueType === 'object' || Array.isArray(value)) {
        xmlObj = {
          ...xmlObj,
          [`<${tag}>`]: JSON.stringify(value)
        }
      }

      if (valueType === 'boolean' || valueType === 'number' || valueType === 'string') {
        xmlObj = {
          ...xmlObj,
          [`<${tag}>`]: value
        }
      }
    }

    for (const tag in xmlObj) {
      const value = xmlObj[tag]
      const parsedObj = this.validateJSONString(value)

      if (parsedObj) {
        if (Array.isArray(parsedObj)) {
          preXML += parsedObj.reduce((previousValue, currentValue) =>
            previousValue += tag + this.convertJSONToXML(currentValue, '') + this.closeTag(tag), '')
        } else {
          preXML += tag + this.convertJSONToXML(parsedObj, '') + this.closeTag(tag)
        }
      } else {
        preXML += tag + value + this.closeTag(tag)
      }
    }

    return preXML
  }

  private checkWhiteListObj = (
    value: unknown
  ): boolean => {
    let valid: boolean = false

    Data.whiteListObj.forEach(obj => {
      if (value instanceof obj) {
        valid = true
      } else {
        valid = false
        return
      }
    })

    return valid
  }

  public flatObject = (
    obj: object,
    options = { safe: true, transformKey: '.' },
    resObj = {},
    mergedKey = ''
  ) => {
    const { safe = true, transformKey = '.' } = options
    for (const key in obj) {
      const value = obj[key]
      const isObject = safe
        ? typeof value === 'object' && !Array.isArray(value)
        : typeof value === 'object'
      const isInWhiteList = this.checkWhiteListObj(value)

      const nextKey = mergedKey ? mergedKey + transformKey + key : key
      if (isObject && !isInWhiteList) {
        this.flatObject(value, options, resObj, nextKey)
      } else {
        resObj[nextKey] = value
      }
    }
    return resObj
  }

  public parseEmojiToUnicode(txt: string): string {
    const unifiedEmojiRanges = [
      '\ud83c[\udf00-\udfff]',
      '\ud83d[\udc00-\ude4f]',
      '\ud83d[\ude80-\udeff]'
    ]
    const emojiReg = new RegExp(unifiedEmojiRanges.join('|'), 'g')

    return txt.replace(emojiReg, matchedVal =>
      `U+${matchedVal.codePointAt(0)?.toString(16)}`.toUpperCase()
    )
  }

  public handleFilename(filename: string): string {
    if (filename) {
      filename = filename.replace(/\s/g, '')
      filename = filename.replace(/(-)\1{1,}/g, '-')
      filename = filename.replace(/(\.)\1{1,}/g, '.')
      filename = filename.replace(/(_)\1{1,}/g, '_')
      filename = filename.replace(/(#)\1{1,}/g, '')
      filename = filename.replace(/`|~|!|@|\$|%|\^|&|\*|\+|\||\\|'|>|\?|\/|''|;/g, '')
      filename = filename.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
      filename = filename.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
      filename = filename.replace(/ì|í|ị|ỉ|ĩ/g, 'i')
      filename = filename.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
      filename = filename.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
      filename = filename.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
      filename = filename.replace(/đ/g, 'd')
      filename = filename.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A')
      filename = filename.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E')
      filename = filename.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I')
      filename = filename.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O')
      filename = filename.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U')
      filename = filename.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y')
      filename = filename.replace(/Đ/g, 'D')
    }
    return filename
  }
}