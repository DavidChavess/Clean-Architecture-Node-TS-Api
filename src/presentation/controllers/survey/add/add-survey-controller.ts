import { Controller, HttpRequest, HttpResponse, Validation } from './add-survey-protocols'
import { badRequest, ok } from '../../../helpers/http/http-helper'

export class AddSurveyController implements Controller {
  constructor (private readonly validation: Validation) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const validationError = this.validation.validate(httpRequest.body)
    if (validationError) {
      return badRequest(validationError)
    }
    return ok({})
  }
}
