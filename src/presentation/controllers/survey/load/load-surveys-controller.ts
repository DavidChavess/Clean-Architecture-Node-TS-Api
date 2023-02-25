import { Controller, HttpRequest, HttpResponse } from '../add/add-survey-protocols'
import { ok } from '../../../helpers/http/http-helper'
import { LoadSurveys } from './load-surveys-protocols'

export class LoadSurveysController implements Controller {
  constructor (private readonly loadSurveys: LoadSurveys) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    await this.loadSurveys.load()
    return ok(null)
  }
}
