import { SignUpController } from './signup'
import { MissingParamError } from '../errors/missing-param'
import { EmailValidator } from '../protocols/email-validator'
import { InvalidParamError } from '../errors/invalid-param'

class EmailValidatorStub implements EmailValidator {
  isValid (email: string): boolean {
    return true
  }
}

describe('Signup Controller', () => {
  let _sut: SignUpController
  let _emailValidatorStub: EmailValidator

  beforeEach(() => {
    _emailValidatorStub = new EmailValidatorStub()
    _sut = new SignUpController(_emailValidatorStub)
  })

  test('Should return 400 if no name is provided', () => {
    const httpRequest = {
      body: {
        email: 'davi.ch.fe@gmail.com',
        password: 'any_pass',
        passwordConfirmation: 'any_pass'
      }
    }
    const httpResponse = _sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  test('Should return 400 if no email is provided', () => {
    const httpRequest = {
      body: {
        name: 'David Chaves Ferreira',
        password: 'any_pass',
        passwordConfirmation: 'any_pass'
      }
    }
    const httpResponse = _sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('Should return 400 if no password is provided', () => {
    const httpRequest = {
      body: {
        name: 'David Chaves Ferreira',
        email: 'davi.ch.fe@gmail.com',
        passwordConfirmation: 'any_pass'
      }
    }
    const httpResponse = _sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('Should return 400 if no passwordConfirmation is provided', () => {
    const httpRequest = {
      body: {
        name: 'David Chaves Ferreira',
        email: 'davi.ch.fe@gmail.com',
        password: 'any_pass'
      }
    }
    const httpResponse = _sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
  })

  test('Should return 400 if an invalid email is provided', () => {
    const httpRequest = {
      body: {
        name: 'David Chaves Ferreira',
        email: 'invalid-email@gmail.com',
        password: 'any_pass',
        passwordConfirmation: 'any_pass'
      }
    }
    jest.spyOn(_emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpResponse = _sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  test('Should call EmailValidator with correct email', () => {
    const httpRequest = {
      body: {
        name: 'David Chaves Ferreira',
        email: 'any_email@gmail.com',
        password: 'any_pass',
        passwordConfirmation: 'any_pass'
      }
    }
    const isValidSpy = jest.spyOn(_emailValidatorStub, 'isValid')
    _sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('any_email@gmail.com')
  })
})
