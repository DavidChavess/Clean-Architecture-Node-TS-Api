import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { ok } from '@/presentation/helpers/http/http-helper'
import { LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id'

export class LoadSurveyResultController implements Controller {
  constructor (private readonly loadSurveyById: LoadSurveyById) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    await this.loadSurveyById.loadById(httpRequest.params.surveyId)
    return ok({})
  }
}
