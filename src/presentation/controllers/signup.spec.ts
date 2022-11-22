import { SignUpController } from './signup'
import { MissingParamError } from '../errors'
import { AddAccount, AddAccountModel, AccountModel, HttpRequest, Validation } from './signup/signup-protocols'
import { badRequest, created, serverError } from '../helpers/http/http-helper'

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
  let _addAccountStub: AddAccount
  let _validationStub: Validation

  beforeEach(() => {
    _addAccountStub = new AddAccountStub()
    _validationStub = new ValidationStub()
    _sut = new SignUpController(_addAccountStub, _validationStub)
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
