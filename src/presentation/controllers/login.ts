import { InvalidParamError, MissingParamError } from '../errors'
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
      this.validation.validate(httpRequest.body)
      const { email, password } = httpRequest.body
      const invalidField = ['email', 'password'].find(field => !httpRequest.body[field])
      if (invalidField) {
        return badRequest(new MissingParamError(invalidField))
      }
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
