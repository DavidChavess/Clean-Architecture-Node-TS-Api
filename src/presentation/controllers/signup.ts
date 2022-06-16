import { MissingParamError } from '../errors/missing-param'
import { badRequest } from '../helpers/http-helper'
import { httpRequest, httpResponse } from '../protocols/https'

export class SignUpController {
  handle (httpRequest: httpRequest): httpResponse {
    if (!httpRequest.body.name) {
      return badRequest(new MissingParamError('name'))
    }
    if (!httpRequest.body.email) {
      return badRequest(new MissingParamError('email'))
    }
    return {
      statusCode: 200,
      body: {}
    }
  }
}
