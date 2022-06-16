import { httpRequest, httpResponse } from '../protocols/https'

export class SignUpController {
  handle (httpRequest: httpRequest): httpResponse {
    const body = new Error('')

    if (!httpRequest.body.name) {
      body.message = 'Missing param: name'
    }
    if (!httpRequest.body.email) {
      body.message = 'Missing param: email'
    }
    return {
      statusCode: 400,
      body
    }
  }
}
