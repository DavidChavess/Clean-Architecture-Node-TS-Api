import { SignUpController } from './signup'
import { InvalidParamError, MissingParamError, InternalServerError } from '../errors'
import { AddAccount, AddAccountModel, EmailValidator, AccountModel } from './signup/signup-protocols'

class EmailValidatorStub implements EmailValidator {
  isValid (email: string): boolean {
    return true
  }
}

class AddAccountStub implements AddAccount {
  async add (account: AddAccountModel): Promise<AccountModel> {
    const fakeAccount = {
      id: 'valid id',
      name: 'valid name',
      email: 'valid email',
      password: 'valid password'
    }
    return await new Promise(resolve => resolve(fakeAccount))
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

  test('Should return 400 if no name is provided', async () => {
    const httpRequest = {
      body: {
        email: 'davi.ch.fe@gmail.com',
        password: 'any_pass',
        passwordConfirmation: 'any_pass'
      }
    }
    const httpResponse = await await _sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  test('Should return 400 if no email is provided', async () => {
    const httpRequest = {
      body: {
        name: 'David Chaves Ferreira',
        password: 'any_pass',
        passwordConfirmation: 'any_pass'
      }
    }
    const httpResponse = await _sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('Should return 400 if no password is provided', async () => {
    const httpRequest = {
      body: {
        name: 'David Chaves Ferreira',
        email: 'davi.ch.fe@gmail.com',
        passwordConfirmation: 'any_pass'
      }
    }
    const httpResponse = await _sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('Should return 400 if no passwordConfirmation is provided', async () => {
    const httpRequest = {
      body: {
        name: 'David Chaves Ferreira',
        email: 'davi.ch.fe@gmail.com',
        password: 'any_pass'
      }
    }
    const httpResponse = await _sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
  })

  test('Should return 400 if an invalid email is provided', async () => {
    const httpRequest = {
      body: {
        name: 'David Chaves Ferreira',
        email: 'invalid-email@gmail.com',
        password: 'any_pass',
        passwordConfirmation: 'any_pass'
      }
    }
    jest.spyOn(_emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpResponse = await _sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  test('Should call EmailValidator with correct email', async () => {
    const httpRequest = {
      body: {
        name: 'David Chaves Ferreira',
        email: 'any_email@gmail.com',
        password: 'any_pass',
        passwordConfirmation: 'any_pass'
      }
    }
    const isValidSpy = jest.spyOn(_emailValidatorStub, 'isValid')
    await _sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('any_email@gmail.com')
  })

  test('Should return 500 if EmailValidator thorws', async () => {
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
    const httpResponse = await _sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new InternalServerError())
  })

  test('Should return 400 if passwordConfirmation fails', async () => {
    const httpRequest = {
      body: {
        name: 'David Chaves Ferreira',
        email: 'invalid-email@gmail.com',
        password: 'any_pass',
        passwordConfirmation: 'invalid_pass'
      }
    }
    const httpResponse = await _sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'))
  })

  test('Should call AddAcoount with correct values', async () => {
    const httpRequest = {
      body: {
        name: 'David Chaves Ferreira',
        email: 'davi.ch.fe@gmail.com',
        password: 'any_pass',
        passwordConfirmation: 'any_pass'
      }
    }
    const addSpy = jest.spyOn(_addAccountStub, 'add')
    const httpResponse = await _sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(201)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'David Chaves Ferreira',
      email: 'davi.ch.fe@gmail.com',
      password: 'any_pass'
    })
  })

  test('Should return 500 if AddAccount thorws', async () => {
    jest.spyOn(_addAccountStub, 'add').mockImplementationOnce(async () => {
      return await new Promise((resolve, reject) => reject(new Error()))
    })
    const httpRequest = {
      body: {
        name: 'David Chaves Ferreira',
        email: 'any_email@gmail.com',
        password: 'any_pass',
        passwordConfirmation: 'any_pass'
      }
    }
    const httpResponse = await _sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new InternalServerError())
  })

  test('Should return 201 if valid data is provided', async () => {
    const httpRequest = {
      body: {
        name: 'valid name',
        email: 'valid email',
        password: 'valid password',
        passwordConfirmation: 'valid password'
      }
    }
    const account: AccountModel = {
      id: 'valid id',
      name: 'valid name',
      email: 'valid email',
      password: 'valid password'
    }
    const httpResponse = await _sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(201)
    expect(httpResponse.body).toEqual(account)
  })
})
