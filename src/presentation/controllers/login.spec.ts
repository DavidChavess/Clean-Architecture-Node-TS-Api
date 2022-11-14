import { MissingParamError } from '../errors'
import { badRequest } from '../helpers/http-helper'
import { HttpRequest } from '../protocols'
import { LoginController } from './login'

describe('Login Controller', () => {
  let _sut: LoginController

  beforeEach(() => {
    _sut = new LoginController()
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
})
