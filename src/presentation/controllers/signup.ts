import { MissingParamError } from '../errors/missing-param'
import { badRequest } from '../helpers/http-helper'
import { HttpRequest, HttpResponse } from '../protocols/http'

export class SignUpController {
  handle (httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
    return requiredFields
      .filter(field => !httpRequest.body[field])
      .map(field => badRequest(new MissingParamError(field)))[0]
  }
}
