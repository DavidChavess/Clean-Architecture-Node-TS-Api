import { InvalidParamError } from '../errors'
import { badRequest, serverError, unauthorized, ok } from '../helpers/http-helper'
import { Controller, HttpRequest, HttpResponse, EmailValidator, Authentication, Validation } from './login/login-protocols'

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly authentication: Authentication
  private readonly validation: Validation

  constructor (emailValidator: EmailValidator, authentication: Authentication, validation: Validation) {
    this.emailValidator = emailValidator
    this.authentication = authentication
    this.validation = validation
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { email, password } = httpRequest.body
      if (!this.emailValidator.isValid(email)) {
        return badRequest(new InvalidParamError('email'))
      }
      const accessToken = await this.authentication.auth(email, password)
      if (!accessToken) {
        return unauthorized()
      }
      return ok({ accessToken })
    } catch (error) {
      return serverError(error)
    }
  }
}
