import { InvalidParamError, MissingParamError } from '../errors'
import { badRequest } from '../helpers/http-helper'
import { HttpRequest } from '../protocols'
import { EmailValidator } from '../protocols/email-validator'
import { LoginController } from './login'

class EmailValidatorStub implements EmailValidator {
  isValid (email: string): boolean {
    return true
  }
}

describe('Login Controller', () => {
  let _sut: LoginController
  let _emailValidatorStub: EmailValidatorStub

  beforeEach(() => {
    _emailValidatorStub = new EmailValidatorStub()
    _sut = new LoginController(_emailValidatorStub)
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
})
