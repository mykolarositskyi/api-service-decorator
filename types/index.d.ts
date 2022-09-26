import { Constructor } from './constructor';
/**
 * An abstract class in case if you don't want to use __@Service()__ decorator instead you want to pass http service to class constructor
 * @example
 * class TodoService extends HttpProvider {} // it extends constructor(protected http: BaseHttpService) {}
 *
 * class ApiService {
 *    public todoService = new TodoService(new HttpService())
 * }
 */
export declare abstract class HttpProvider {
    protected http: BaseHttpService;
    constructor(http: BaseHttpService);
}
export interface BaseHttpService {
    baseUrl: string;
    request: (input: RequestInfo, init: RequestInit) => Promise<any>;
}
interface EnhancedHttpService {
    setBaseUrl?(url: string): void;
    setRequestOptions?(options: RequestInit): void;
}
/**
 * Basic http service
 * @property {string} baseUrl - base url for api requests
 * @property {function} setBaseUrl - function that will set baseUrl property
 */
declare class HttpService implements BaseHttpService, EnhancedHttpService {
    /**
     * Base url for api requests
     * @example
     * `https://jsonplaceholder.typicode.com`
     */
    baseUrl: string;
    private requestOptions;
    /**
     * Assign base url
     * @param url string
     */
    setBaseUrl(url: string): void;
    /**
     * Set request options for every request
     * @param options
     */
    setRequestOptions(options: RequestInit): void;
    request(input: RequestInfo, init: RequestInit): Promise<any>;
}
/**
 * Default http service, can be re-assigned if user provide custom http service using `function setHttpService(http: BaseHttpService)`
 */
declare let http: HttpService;
declare const setHttpService: (CustomHttpService: Constructor<BaseHttpService>) => void;
declare function Service(): (constructor: Constructor<any>) => Constructor<any>;
export type { Promised } from './promised';
export { Api } from './api.decorator';
export { http, setHttpService, Service, HttpService };
