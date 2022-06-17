import { SignUpController } from './signup'
import { MissingParamError } from '../errors/missing-param'

describe('Signup Controller', () => {
  let _sut: SignUpController

  beforeEach(() => {
    _sut = new SignUpController()
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
})
