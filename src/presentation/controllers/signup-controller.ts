import { AddAccount, Authentication } from '@/domain/usecases'
import { Controller, HttpResponse, Validation } from '@/presentation/protocols'
import { EmailInUseError } from '@/presentation/errors'
import { badRequest, created, forbidden, serverError } from '@/presentation/helpers'

export class SignUpController implements Controller {
  constructor (
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly authentication: Authentication
  ) {}

  async handle (request: SignUpController.Request): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request)
      if (error) {
        return badRequest(error)
      }
      const { name, password, email } = request
      const isValidAccount = await this.addAccount.add({ name, password, email })
      if (!isValidAccount) {
        return forbidden(new EmailInUseError())
      }
      const authenticationModel = await this.authentication.auth({ email, password })
      return created(authenticationModel)
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace SignUpController {
  export type Request = {
    name: string
    email: string
    password: string
    passwordConfirmation: string
  }
}
