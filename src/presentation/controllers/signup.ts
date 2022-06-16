import { MissingParamError } from '../errors/missing-param'
import { httpRequest, httpResponse } from '../protocols/https'

export class SignUpController {
  handle (httpRequest: httpRequest): httpResponse {
    const httpResponse: httpResponse = {
      statusCode: 400,
      body: null
    }
    if (!httpRequest.body.name) {
      httpResponse.body = new MissingParamError('name')
    }
    if (!httpRequest.body.email) {
      httpResponse.body = new MissingParamError('email')
    }
    return httpResponse
  }
}
