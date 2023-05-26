import { LoginController } from '@/presentation/controllers'
import { Authentication } from '@/domain/usecases'
import { HttpRequest, Validation } from '@/presentation/protocols'
import { MissingParamError } from '@/presentation/errors'
import { badRequest, serverError, unauthorized, ok } from '@/presentation/helpers'
import { mockAuthentication } from '@/tests/presentation/mocks'
import { mockValidation } from '@/tests/validation/mocks'

describe('Login Controller', () => {
  let _sut: LoginController
  let _authenticationStub: Authentication
  let _validationStub: Validation

  beforeEach(() => {
    _authenticationStub = mockAuthentication()
    _validationStub = mockValidation()
    _sut = new LoginController(_authenticationStub, _validationStub)
  })

  const makeHttpRequest = (): HttpRequest => ({
    body: {
      email: 'any_email',
      password: 'any_pass'
    }
  })

  test('Should call authentication with correct values', async () => {
    const spyAuthentication = jest.spyOn(_authenticationStub, 'auth')
    await _sut.handle(makeHttpRequest())
    expect(spyAuthentication).toHaveBeenCalledWith({ email: 'any_email', password: 'any_pass' })
  })

  test('Should return 401 if invalid credentials are provided', async () => {
    jest.spyOn(_authenticationStub, 'auth').mockResolvedValueOnce(null)
    const httpResponse = await _sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(unauthorized())
  })

  test('Should return 500 if Authentication throws', async () => {
    jest.spyOn(_authenticationStub, 'auth').mockRejectedValueOnce(new Error('any_error'))
    const httpResponse = await _sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(serverError(new Error('any_error')))
  })

  test('Should call validation with correct value', async () => {
    const spyValidation = jest.spyOn(_validationStub, 'validate')
    await _sut.handle(makeHttpRequest())
    expect(spyValidation).toHaveBeenCalledWith(makeHttpRequest().body)
  })

  test('Should return 400 if validation returns an erro', async () => {
    jest.spyOn(_validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
    const httpResponse = await _sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })

  test('Should return 200 if valid credentials are provided', async () => {
    const httpResponse = await _sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(ok({ name: 'any_name', accessToken: 'any_token' }))
  })
})
