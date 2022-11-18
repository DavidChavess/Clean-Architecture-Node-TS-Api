import { SignUpController } from './signup'
import { InvalidParamError, MissingParamError } from '../errors'
import { AddAccount, AddAccountModel, EmailValidator, AccountModel, HttpRequest, Validation } from './signup/signup-protocols'
import { badRequest, created, serverError } from '../helpers/http-helper'

class EmailValidatorStub implements EmailValidator {
  isValid (email: string): boolean {
    return true
  }
}

class AddAccountStub implements AddAccount {
  async add (account: AddAccountModel): Promise<AccountModel> {
    return makeFakeAccount()
  }
}

class ValidationStub implements Validation {
  validate (input: string): Error | null {
    return null
  }
}

const makeHttpRequest = (): HttpRequest => ({
  body: {
    name: 'David Chaves Ferreira',
    email: 'any_email@gmail.com',
    password: 'any_pass',
    passwordConfirmation: 'any_pass'
  }
})

const makeFakeAccount = (): AccountModel => ({
  id: 'valid id',
  name: 'valid name',
  email: 'valid email',
  password: 'valid password'
})

describe('Signup Controller', () => {
  let _sut: SignUpController
  let _emailValidatorStub: EmailValidator
  let _addAccountStub: AddAccount
  let _validationStub: Validation

  beforeEach(() => {
    _emailValidatorStub = new EmailValidatorStub()
    _addAccountStub = new AddAccountStub()
    _validationStub = new ValidationStub()
    _sut = new SignUpController(_emailValidatorStub, _addAccountStub, _validationStub)
  })

  test('Should return 400 if an invalid email is provided', async () => {
    jest.spyOn(_emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpResponse = await _sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  test('Should call EmailValidator with correct email', async () => {
    const isValidSpy = jest.spyOn(_emailValidatorStub, 'isValid')
    await _sut.handle(makeHttpRequest())
    expect(isValidSpy).toHaveBeenCalledWith('any_email@gmail.com')
  })

  test('Should return 500 if EmailValidator thorws', async () => {
    jest.spyOn(_emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await _sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
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
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('passwordConfirmation')))
  })

  test('Should call AddAcoount with correct values', async () => {
    const addSpy = jest.spyOn(_addAccountStub, 'add')
    const httpResponse = await _sut.handle(makeHttpRequest())
    expect(httpResponse.statusCode).toBe(201)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'David Chaves Ferreira',
      email: 'any_email@gmail.com',
      password: 'any_pass'
    })
  })

  test('Should return 500 if AddAccount thorws', async () => {
    jest.spyOn(_addAccountStub, 'add').mockRejectedValueOnce(new Error())
    const httpResponse = await _sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should call validation with correct value', async () => {
    const spyValidation = jest.spyOn(_validationStub, 'validate')
    await _sut.handle(makeHttpRequest())
    expect(spyValidation).toHaveBeenCalledWith(makeHttpRequest().body)
  })

  test('Should return 201 if valid data is provided', async () => {
    const httpResponse = await _sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(created(makeFakeAccount()))
  })

  test('Should return 400 if validation returns an erro', async () => {
    jest.spyOn(_validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
    const httpResponse = await _sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })
})
