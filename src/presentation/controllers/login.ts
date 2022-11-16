import { Authentication } from '../../domain/usecases/authentication'
import { InvalidParamError, MissingParamError } from '../errors'
import { badRequest, serverError, unauthorized } from '../helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../protocols'
import { EmailValidator } from '../protocols/email-validator'

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly authentication: Authentication

  constructor (emailValidator: EmailValidator, authentication: Authentication) {
    this.emailValidator = emailValidator
    this.authentication = authentication
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
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
      return {
        body: { accessToken },
        statusCode: 200
      }
    } catch (error) {
      return serverError(error)
    }
  }
}
