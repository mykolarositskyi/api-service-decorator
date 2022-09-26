# Decorated API services

Simplify your REST API structure with **@Service()** and **@Api()** decorators

## Installation

Install **api-service-decorators** with npm

```bash
  npm install api-service-decorator
```

## API Reference

### Service decorator

```
  @Service()
```

This decorator injects your class with a default HTTP instance, to provide request functionality.

### Api decorator

```
  @Api({ method: 'GET', url: '/users' })
```

This decorator is used in methods of the class to execute requests.
It accepts all params of a `fetch()` (see an [**interface RequestInit**](https://www.google.com) for more information).

Decorator `@Api<UrlParams, Payload, Response>()` accepts three [generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)

- **UrlParams** - in case you want to pass params to the URL, you can add them through the second argument of your method, and get access to it through decorator's prop `url: (params) => string`
- **Payload** - this can be typed and used lately for decorator's prop `middleware before?()`
- **Response** - this can be typed and used lately for decorator's prop `middleware after?()`

_Note: you don't have to use these generics everytime._

_You would need them in case of:_

_– Using query params, and you want params to be typed._

_– Using `before?[]()` or `after?[]()` middleware to type Payload or Response_

Also, it accepts some additional props that make this decorator more powerful:

| Parameters | Type                                          | Description                                                |
| :--------- | :-------------------------------------------- | :--------------------------------------------------------- |
| `url`      | `string` or `((params: UrlParams) => string)` | **Required**. Provide an endpoint url                      |
| `before?`  | `Array<(payload: Payload) => any`             | Middleware functions to execute before API call            |
| `after?`   | `Array<(response: Response) => any`           | Middleware functions to execute after API call             |
| `log?`     | `boolean`                                     | Report some informative data about API call to the console |

## Guide

- Basic example of usage

```typescript
import { Api, Service, Promised } from 'api-service-decorator'

type FetchUsersResponse = { username: string }[]
type FetchUsersFailure = { error: 'something went wrong' }

@Service()
class UsersService {
  @Api({ method: 'GET', url: '/users' })
  async fetchUsers(): Promised<FetchUsersResponse, FetchUsersFailure> {}
}

async function getUsers() {
  const response = await new UsersService().fetchUsers()
  console.log(response) // FetchUsersResponse
}
```

- How to apply query params

```typescript
import { Api, Service, Promised } from 'api-service-decorator'

type FetchUserParams = { id: string }
type FetchUserResponse = { username: string }
type FetchUserFailure = { error: 'something went wrong' }

@Service()
class UsersService {
  @Api<undefined, FetchUserParams>({ method: 'GET', url: (params) => `/user/${params.id}` })
  async fetchUser(_: undefined, params: FetchUserParams): Promised<FetchUserResponse, FetchUserFailure> {}
}

async function getUser(id: string) {
  const response = await new UsersService().fetchUser(undefined, { id })
  console.log(response) // FetchUserResponse
}
```

- How to use POST/PUT requests

```typescript
import { Api, Service, Promised } from 'api-service-decorator'

type CreateTodoPayload = { title: string }
type CreateTodoResponse = { isCreated: boolean }
type CreateTodoFailure = { error: 'something went wrong' }

@Service()
class TodoService {
  @Api({ method: 'POST', url: `/todo` })
  async createTodo(payload: CreateTodoPayload): Promised<CreateTodoResponse, CreateTodoFailure> {}
}

async function createTodo(title: string) {
  const response = await new TodoService().createTodo({ title: 'Learn JS' })
  console.log(response) // CreateTodoResponse
}
```

- Change base URL for API requests

```typescript
import { http } from 'api-service-decorator'

http.setBaseUrl('https://api-url.com')
```

- Set HTTP options for each request

```typescript
import { http } from 'api-service-decorator'

http.setRequestOptions({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
})
```

- In case you want to use your custom HTTP service, you can provide it by using `setHttpProvider(service: BaseHttpService)`

_Note: you should use this function in the file with initialized HTTP service._

```typescript
import { setHttpProvider, BaseHttpService } from 'api-service-decorator'
import axios from 'axios'

class MyHttpService implements BaseHttpService {
  public baseUrl = 'https://api-url.com'
  public async request(input: RequestInfo, init: RequestInfo) {
    // ...your implementation

    /**
     * @example using axios
     */
    const response = await axios({
      baseURL: this.baseUrl,
      method: init.method,
      url: input,
    })

    return response.data
  }
}

setHttpProvider(MyHttpService)

export { MyHttpService }
```

## Authors

- [@mykolarositskyi](https://www.github.com/mykolarositskyi)

## License

[MIT](https://choosealicense.com/licenses/mit/)
