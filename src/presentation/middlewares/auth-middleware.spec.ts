import { ok, forbidden, AccessDeniedError, LoadAccountByToken, AccountModel, HttpRequest } from './auth-middleware-protocols'
import { AuthMiddleware } from './auth-middleware'

const makeFakeAccountModel = (): AccountModel => ({
  id: 'valid id',
  name: 'valid name',
  email: 'valid email',
  password: 'valid password'
})

const makeFakeRequest = (): HttpRequest => ({
  headers: { 'x-access-token': 'any_token' }
})

class LoadAccountByTokenStub implements LoadAccountByToken {
  async load (accessToken: string, role?: string): Promise<AccountModel | null> {
    return makeFakeAccountModel()
  }
}

describe('Auth Middleware', () => {
  let _sut: AuthMiddleware
  let _loadAccountByTokenStub: LoadAccountByToken

  beforeEach(() => {
    _loadAccountByTokenStub = new LoadAccountByTokenStub()
    _sut = new AuthMiddleware(_loadAccountByTokenStub)
  })

  test('Should returns 403 if no header are found', async () => {
    const httpResponse = await _sut.handle({})
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should calls LoadAccountByToken with correct values', async () => {
    const loadAccountSpy = jest.spyOn(_loadAccountByTokenStub, 'load')
    await _sut.handle(makeFakeRequest())
    expect(loadAccountSpy).toHaveBeenCalledWith('any_token')
  })

  test('Should return 403 if LoadAccountByToken returns null', async () => {
    jest.spyOn(_loadAccountByTokenStub, 'load').mockResolvedValueOnce(null)
    const httpResponse = await _sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should return 200 if LoadAccountByToken returns an account', async () => {
    const httpResponse = await _sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok({ accountId: 'valid id' }))
  })
})
