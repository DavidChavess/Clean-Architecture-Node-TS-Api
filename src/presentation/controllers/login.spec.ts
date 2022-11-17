import { InvalidParamError, MissingParamError } from '../errors'
import { badRequest, serverError, unauthorized, ok } from '../helpers/http-helper'
import { HttpRequest, EmailValidator, Authentication } from './login/login-protocols'
import { LoginController } from './login'

class EmailValidatorStub implements EmailValidator {
  isValid (email: string): boolean {
    return true
  }
}

class AuthenticationStub implements Authentication {
  async auth (email: string, password: string): Promise<string> {
    return 'any_token'
  }
}

describe('Login Controller', () => {
  let _sut: LoginController
  let _emailValidatorStub: EmailValidatorStub
  let _authenticationStub: AuthenticationStub

  beforeEach(() => {
    _emailValidatorStub = new EmailValidatorStub()
    _authenticationStub = new AuthenticationStub()
    _sut = new LoginController(_emailValidatorStub, _authenticationStub)
  })

  const makeHttpRequest = (): HttpRequest => ({
    body: {
      email: 'any_email',
      password: 'any_pass'
    }
  })

  test('Should return 400 if no email is provided', async () => {
    const httpRequest: HttpRequest = {
      body: {
        password: 'any_pass'
      }
    }
    const HttpResponse = await _sut.handle(httpRequest)
    expect(HttpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  test('Should return 400 if no password is provided', async () => {
    const httpRequest: HttpRequest = {
      body: {
        email: 'any_email'
      }
    }
    const HttpResponse = await _sut.handle(httpRequest)
    expect(HttpResponse).toEqual(badRequest(new MissingParamError('password')))
  })

  test('Should call emailValidator with correct value', async () => {
    const spyEmailValidator = jest.spyOn(_emailValidatorStub, 'isValid')
    await _sut.handle(makeHttpRequest())
    expect(spyEmailValidator).toHaveBeenCalledWith('any_email')
  })

  test('Should return InvalidParamError reponse if email is invalid', async () => {
    jest.spyOn(_emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpResponse = await _sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  test('Should return 500 if EmailValidator throws', async () => {
    jest.spyOn(_emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error('any_error')
    })
    const httpResponse = await _sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(serverError(Error('any_error')))
  })

  test('Should call authentication with correct values', async () => {
    const spyAuthentication = jest.spyOn(_authenticationStub, 'auth')
    await _sut.handle(makeHttpRequest())
    expect(spyAuthentication).toHaveBeenCalledWith('any_email', 'any_pass')
  })

  test('Should return 401 if invalid credentials are provided', async () => {
    jest.spyOn(_authenticationStub, 'auth').mockResolvedValueOnce('')
    const httpResponse = await _sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(unauthorized())
  })

  test('Should return 500 if Authentication throws', async () => {
    jest.spyOn(_authenticationStub, 'auth').mockRejectedValueOnce(new Error('any_error'))
    const httpResponse = await _sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(serverError(new Error('any_error')))
  })

  test('Should return 200 if valid credentials are provided', async () => {
    const httpResponse = await _sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }))
  })
})
