import { BaseHttpService } from './index'

type ApiProps<Payload = void, UrlParams = void, Response = void> = RequestInit & {
  /**
   * If you need to grab params for the url, you can pass function instead of string
   * @example
   * (params => `/users/${params.id}`)
   */
  readonly url: string | ((params: UrlParams) => string)
  /**
   * Report some informative data about api call to console
   */
  readonly log?: boolean
  /**
   * Middleware functions to execute before api call
   */
  readonly before?: Array<(payload: Payload) => Promise<any> | any>
  /**
   * Middleware functions to execute after api call
   */
  readonly after?: Array<(payload: Response) => Promise<any> | any>
}

/**
 * Api decorator for class methods
 * @example
 * ```ts
 *  class TodoService {
 *    _@Api({ method: 'GET', url: '/users' }) // remove underscore
 *    async getUsers() {}
 *  }
 * ```
 * If you need to use params for url, provide them as a second method param you can access it via url using function
 * @example
 * ```ts
 *  type UserId = {
 *    id: string
 *  }
 *  class TodoService {
 *    _@Api<any, any, UserId>({ method: 'GET', url: (params) => `/users/${params.id}` }) // remove underscore
 *    async getUserById(undefined, { id: string }) {}
 *  }
 * ```
 */
export function Api<Payload = void, UrlParams = void, Response = void>({
  url,
  log,
  before,
  after,
  ...requestInit
}: ApiProps<Payload, UrlParams, Response>) {
  return function (target: Object, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.value = async function (data: any, urlParams?: any): Promise<any> {
      try {
        type _This = typeof target & { http: BaseHttpService }
        const httpService: BaseHttpService = (this as _This).http
        let urlPath = url
        if (typeof url === 'function') {
          urlPath = url(urlParams)
        }

        if (['POST', 'PUT', 'DELETE'].includes(requestInit.method ?? '')) {
          requestInit.body = data
          requestInit.headers = {
            'Content-type': 'application/json; charset=UTF-8',
          }
        }

        if (before && before.length > 0) {
          for (const fn of before) {
            requestInit.body = fn(requestInit.body as Payload)
          }
        }

        console.time(`request time ${urlPath}`)

        let response = await httpService.request(urlPath as string, requestInit)

        if (after && after.length > 0) {
          for (const fn of after) {
            response = fn(response as Response)
          }
        }

        if (log) {
          console.group(`Request ${urlPath}`)
          console.log(`payload:`, data)
          console.log(`url params:`, urlParams)
          console.log('response:', response)
          console.timeEnd(`request time ${urlPath}`)
          console.groupEnd()
        }
        return Promise.resolve(response)
      } catch (err) {
        console.log(err)
        return Promise.reject(err)
      }
    }
    return descriptor
  }
}
