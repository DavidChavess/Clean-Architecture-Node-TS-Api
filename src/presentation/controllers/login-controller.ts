import { Authentication } from '@/domain/usecases'
import { Controller, HttpRequest, HttpResponse, Validation } from '@/presentation/protocols'
import { badRequest, serverError, unauthorized, ok } from '@/presentation/helpers'

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
