declare type ApiProps<Payload = void, UrlParams = void, Response = void> = RequestInit & {
    /**
     * If you need to grab params for the url, you can pass function instead of string
     * @example
     * (params => `/users/${params.id}`)
     */
    readonly url: string | ((params: UrlParams) => string);
    /**
     * Report some informative data about api call to console
     */
    readonly log?: boolean;
    /**
     * Middleware functions to execute before api call
     */
    readonly before?: Array<(payload: Payload) => Promise<any> | any>;
    /**
     * Middleware functions to execute after api call
     */
    readonly after?: Array<(payload: Response) => Promise<any> | any>;
};
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
export declare function Api<Payload = void, UrlParams = void, Response = void>({ url, log, before, after, ...requestInit }: ApiProps<Payload, UrlParams, Response>): (target: Object, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
export {};
