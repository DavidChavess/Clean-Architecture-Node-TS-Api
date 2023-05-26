import { AuthMiddleware } from '@/presentation/middlewares'
import { LoadAccountByToken } from '@/domain/usecases'
import { serverError, ok, forbidden } from '@/presentation/helpers'
import { AccessDeniedError } from '@/presentation/errors'
import { HttpRequest } from '@/presentation/protocols'
import { mockLoadAccountByToken } from '@/tests/presentation/mocks'

const makeFakeRequest = (): HttpRequest => ({
  headers: { 'x-access-token': 'any_token' }
})

describe('Auth Middleware', () => {
  let _sut: AuthMiddleware
  let _loadAccountByTokenStub: LoadAccountByToken

  beforeEach(() => {
    _loadAccountByTokenStub = mockLoadAccountByToken()
    _sut = new AuthMiddleware(_loadAccountByTokenStub)
  })

  test('Should returns 403 if no header are found', async () => {
    const httpResponse = await _sut.handle({})
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should calls LoadAccountByToken with correct values', async () => {
    const loadAccountSpy = jest.spyOn(_loadAccountByTokenStub, 'load')
    const sut = new AuthMiddleware(_loadAccountByTokenStub, 'admin')
    await sut.handle(makeFakeRequest())
    expect(loadAccountSpy).toHaveBeenCalledWith('any_token', 'admin')
  })

  test('Should return 403 if LoadAccountByToken returns null', async () => {
    jest.spyOn(_loadAccountByTokenStub, 'load').mockResolvedValueOnce(null)
    const httpResponse = await _sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should return 500 if LoadAccountByToken throws', async () => {
    jest.spyOn(_loadAccountByTokenStub, 'load').mockRejectedValueOnce(new Error('any error'))
    const httpResponse = await _sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error('any error')))
  })

  test('Should return 200 if LoadAccountByToken returns an account', async () => {
    const httpResponse = await _sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok({ accountId: 'any_id' }))
  })
})
