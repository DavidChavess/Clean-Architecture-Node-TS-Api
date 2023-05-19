import { Controller, HttpRequest, HttpResponse, Authentication, Validation } from './login-controller-protocols'
import { badRequest, serverError, unauthorized, ok } from '@/presentation/helpers/http/http-helper'

export class LoginController implements Controller {
  constructor (
    private readonly authentication: Authentication,
    private readonly validation: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { email, password } = httpRequest.body
      const authenticatioModel = await this.authentication.auth({ email, password })

      if (!authenticatioModel) {
        return unauthorized()
      }

      return ok(authenticatioModel)
    } catch (error) {
      return serverError(error)
    }
  }
}
