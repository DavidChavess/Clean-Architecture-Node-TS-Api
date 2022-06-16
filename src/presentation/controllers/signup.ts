import { MissingParamError } from '../errors/missing-param'
import { badRequest } from '../helpers/http-helper'
import { httpRequest, httpResponse } from '../protocols/https'

export class SignUpController {
  handle (httpRequest: httpRequest): httpResponse {
    const requiredFields = ['name', 'email', 'password']
    return requiredFields
      .filter(field => !httpRequest.body[field])
      .map(field => badRequest(new MissingParamError(field)))[0]
  }
}
