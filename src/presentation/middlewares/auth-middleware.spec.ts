import { forbidden, AccessDeniedError } from './auth-middleware-protocols'
import { AuthMiddleware } from './auth-middleware'

describe('Auth Middleware', () => {
  test('Should returns 403 if no header are found', async () => {
    const sut = new AuthMiddleware()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })
})
