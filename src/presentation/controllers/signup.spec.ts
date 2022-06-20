import { SignUpController } from './signup'
import { InvalidParamError, MissingParamError, InternalServerError } from '../errors'
import { AddAccount, AddAccountModel, EmailValidator, AccountModel } from './signup/signup-protocols'

class EmailValidatorStub implements EmailValidator {
  isValid (email: string): boolean {
    return true
  }
}

class AddAccountStub implements AddAccount {
  add (httpRequest: AddAccountModel): AccountModel {
    return {
      id: 'valid id',
      name: 'valid name',
      email: 'valid email',
      password: 'valid password'
    }
  }
}

describe('Signup Controller', () => {
  let _sut: SignUpController
  let _emailValidatorStub: EmailValidator
  let _addAccountStub: AddAccount

  beforeEach(() => {
    _emailValidatorStub = new EmailValidatorStub()
    _addAccountStub = new AddAccountStub()
    _sut = new SignUpController(_emailValidatorStub, _addAccountStub)
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

  test('Should return 500 if EmailValidator thorws', () => {
    jest.spyOn(_emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpRequest = {
      body: {
        name: 'David Chaves Ferreira',
        email: 'any_email@gmail.com',
        password: 'any_pass',
        passwordConfirmation: 'any_pass'
      }
    }
    const httpResponse = _sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new InternalServerError())
  })

  test('Should return 400 if passwordConfirmation fails', () => {
    const httpRequest = {
      body: {
        name: 'David Chaves Ferreira',
        email: 'invalid-email@gmail.com',
        password: 'any_pass',
        passwordConfirmation: 'invalid_pass'
      }
    }
    const httpResponse = _sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'))
  })

  test('Should call AddAcoount with correct values', () => {
    const httpRequest = {
      body: {
        name: 'David Chaves Ferreira',
        email: 'davi.ch.fe@gmail.com',
        password: 'any_pass',
        passwordConfirmation: 'any_pass'
      }
    }
    const addSpy = jest.spyOn(_addAccountStub, 'add')
    const httpResponse = _sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'David Chaves Ferreira',
      email: 'davi.ch.fe@gmail.com',
      password: 'any_pass'
    })
  })

  test('Should return 500 if AddAccount thorws', () => {
    jest.spyOn(_addAccountStub, 'add').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpRequest = {
      body: {
        name: 'David Chaves Ferreira',
        email: 'any_email@gmail.com',
        password: 'any_pass',
        passwordConfirmation: 'any_pass'
      }
    }
    const httpResponse = _sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new InternalServerError())
  })

  test('Should return 200 if valid data is provided', () => {
    const httpRequest = {
      body: {
        name: 'valid name',
        email: 'valid email',
        password: 'valid password',
        passwordConfirmation: 'valid password'
      }
    }
    const httpResponse = _sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      id: 'valid id',
      name: 'valid name',
      email: 'valid email',
      password: 'valid password'
    })
  })
})
