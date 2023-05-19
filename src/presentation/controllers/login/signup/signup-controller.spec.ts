import { SignUpController } from './signup-controller'
import { AddAccount, HttpRequest, Validation, Authentication } from './signup-controller-protocols'
import { MissingParamError, EmailInUseError } from '@/presentation/errors'
import { badRequest, created, forbidden, serverError } from '@/presentation/helpers/http/http-helper'
import { mockValidation } from '@/validation/test'
import { mockAddAccount, mockAuthentication } from '@/presentation/test'

const makeHttpRequest = (): HttpRequest => ({
  body: {
    name: 'David Chaves Ferreira',
    email: 'any_email@gmail.com',
    password: 'any_pass',
    passwordConfirmation: 'any_pass'
  }
})

describe('Signup Controller', () => {
  let _sut: SignUpController
  let _addAccountStub: AddAccount
  let _validationStub: Validation
  let _authenticationStub: Authentication

  beforeEach(() => {
    _addAccountStub = mockAddAccount()
    _validationStub = mockValidation()
    _authenticationStub = mockAuthentication()
    _sut = new SignUpController(_addAccountStub, _validationStub, _authenticationStub)
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
    expect(httpResponse).toEqual(created({ name: 'any_name', accessToken: 'any_token' }))
  })

  test('Should return 400 if validation returns an erro', async () => {
    jest.spyOn(_validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
    const httpResponse = await _sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })

  test('Should call authentication with correct values', async () => {
    const spyAuthentication = jest.spyOn(_authenticationStub, 'auth')
    await _sut.handle(makeHttpRequest())
    expect(spyAuthentication).toHaveBeenCalledWith({
      email: 'any_email@gmail.com',
      password: 'any_pass'
    })
  })

  test('Should return 500 if Authentication throws', async () => {
    jest.spyOn(_authenticationStub, 'auth').mockRejectedValueOnce(new Error('any_error'))
    const httpResponse = await _sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(serverError(new Error('any_error')))
  })

  test('Should return 403 if addAccount return null', async () => {
    jest.spyOn(_addAccountStub, 'add').mockResolvedValueOnce(null)
    const httpResponse = await _sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(forbidden(new EmailInUseError()))
  })
})
