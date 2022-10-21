import { InvalidParamError, MissingParamError } from '../errors'
import { badRequest, ok, serverError } from '../helpers/http-helper'
import { Controller, EmailValidator, HttpRequest, HttpResponse, AddAccount } from './signup/signup-protocols'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount

  constructor (emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const invalidField = ['name', 'email', 'password', 'passwordConfirmation']
        .find(field => !httpRequest.body[field])

      if (invalidField) {
        return badRequest(new MissingParamError(invalidField))
      }

      const { name, password, passwordConfirmation, email } = httpRequest.body
      if (passwordConfirmation !== password) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }

      const isEmailValid = this.emailValidator.isValid(email)
      if (!isEmailValid) {
        return badRequest(new InvalidParamError('email'))
      }
      const account = await this.addAccount.add({ name, email, password })
      return ok(account)
    } catch (error) {
      console.error(error)
      return serverError()
    }
  }
}
