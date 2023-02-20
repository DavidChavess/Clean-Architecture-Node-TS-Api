import { noContent, forbidden, AccessDeniedError, HttpRequest, HttpResponse, Middleware, LoadAccountByToken } from './auth-middleware-protocols'

export class AuthMiddleware implements Middleware {
  constructor (private readonly loadAccountByToken: LoadAccountByToken) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const accessToken = httpRequest?.headers?.['x-access-token']
    if (!accessToken) {
      return forbidden(new AccessDeniedError())
    }

    const account = await this.loadAccountByToken.load(accessToken)
    if (!account) {
      return forbidden(new AccessDeniedError())
    }

    return noContent()
  }
}
