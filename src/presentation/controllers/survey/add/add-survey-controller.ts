import { Controller, HttpRequest, HttpResponse, Validation } from './add-survey-protocols'
import { ok } from '../../../helpers/http/http-helper'

export class AddSurveyController implements Controller {
  constructor (private readonly validation: Validation) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    this.validation.validate(httpRequest.body)
    return ok({})
  }
}
