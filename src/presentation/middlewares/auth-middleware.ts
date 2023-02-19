import { forbidden, AccessDeniedError, HttpRequest, HttpResponse, Middleware } from './auth-middleware-protocols'

export class AuthMiddleware implements Middleware {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    return forbidden(new AccessDeniedError())
  }
}
