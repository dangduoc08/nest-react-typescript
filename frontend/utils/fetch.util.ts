export class Fetch {
  private baseURL: string
  private config: RequestInit
  constructor(baseURL: string, config: RequestInit) {
    this.baseURL = baseURL
    this.config = config
  }

  private buildURL = (url: string) => this.baseURL + url

  private checkResponseContentType = (contentType: string): string => {
    const contentTypeArr: string[] = contentType?.split(';')
    if (contentTypeArr.includes('application/json')) {
      return 'json'
    }
    return 'text'
  }

  private buildRequest<T>(url: string, method: string, body?: BodyInit): Promise<T> {
    return new Promise((resolve, reject) => {
      const {
        credentials,
        headers,
        integrity,
        cache,
        keepalive,
        mode,
        redirect,
        referrer,
        referrerPolicy,
        signal,
        window
      } = this.config
      fetch(this.buildURL(url), {
        method,
        credentials,
        headers,
        cache,
        integrity,
        keepalive,
        mode,
        redirect,
        referrer,
        referrerPolicy,
        signal,
        window,
        body: JSON.stringify(body)
      })
        .then((response: Response) => {
          let contentType: string | null = response.headers.get('content-type')
          let type: string = 'text'
          if (contentType) {
            contentType = contentType.replace(/ +/g, '')
            type = this.checkResponseContentType(contentType)
          }
          return response[type]()
        })
        .then((data: T) => resolve(data))
        .catch((err: Error) => reject(err))
    })
  }

  public async get<T>(url: string): Promise<T> {
    try {
      return await this.buildRequest(url, 'GET')
    } catch (err) {
      return err
    }
  }

  public async post<T>(url: string, body?: BodyInit): Promise<T> {
    try {
      return await this.buildRequest(url, 'POST', body)
    } catch (err) {
      return err
    }
  }

  public async put<T>(url: string, body?: BodyInit): Promise<T> {
    try {
      return await this.buildRequest(url, 'PUT', body)
    } catch (err) {
      return err
    }
  }

  public async delete<T>(url: string): Promise<T> {
    try {
      return await this.buildRequest(url, 'DELETE')
    } catch (err) {
      return err
    }
  }
}