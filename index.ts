import { Constructor } from './constructor'

/**
 * An abstract class in case if you don't want to use __@Service()__ decorator instead you want to pass http service to class constructor
 * @example
 * class TodoService extends HttpProvider {} // it extends constructor(protected http: BaseHttpService) {}
 *
 * class ApiService {
 *    public todoService = new TodoService(new HttpService())
 * }
 */
export abstract class HttpProvider {
  constructor(protected http: BaseHttpService) {}
}

export interface BaseHttpService {
  baseUrl: string
  request: (input: RequestInfo, init: RequestInit) => Promise<any>
}

interface EnhancedHttpService {
  setBaseUrl?(url: string): void
  setRequestOptions?(options: RequestInit): void
}

/**
 * Basic http service
 * @property {string} baseUrl - base url for api requests
 * @property {function} setBaseUrl - function that will set baseUrl property
 */
class HttpService implements BaseHttpService, EnhancedHttpService {
  /**
   * Base url for api requests
   * @example
   * `https://jsonplaceholder.typicode.com`
   */
  public baseUrl: string = ''

  private requestOptions: RequestInit = {}

  /**
   * Assign base url
   * @param url string
   */
  public setBaseUrl(url: string): void {
    this.baseUrl = url
  }

  /**
   * Set request options for every request
   * @param options
   */
  public setRequestOptions(options: RequestInit): void {
    this.requestOptions = options
  }

  public async request(input: RequestInfo, init: RequestInit) {
    try {
      const urlPath = this.baseUrl + input
      init.body = JSON.stringify(init.body)
      Object.assign(init, this.requestOptions)
      const call = await fetch(urlPath, init)
      const response = await call.json()
      return response
    } catch (error) {
      return error
    }
  }
}

/**
 * Default http service, can be re-assigned if user provide custom http service using `function setHttpService(http: BaseHttpService)`
 */
let http: HttpService = new HttpService()

const setHttpService = (CustomHttpService: Constructor<BaseHttpService>) => {
  // @ts-ignore
  http = new CustomHttpService()
}

function Service() {
  return function (constructor: Constructor<any>) {
    constructor.prototype.http = http
    return constructor
  }
}

export type { Promised } from './promised'
export { Api } from './api.decorator'
export { http, setHttpService, Service, HttpService }
