import { Controller, HttpRequest, HttpResponse } from '../../../protocols'
import { LoadSurveys, ok } from './load-surveys-protocols'

export class LoadSurveysController implements Controller {
  constructor (private readonly loadSurveys: LoadSurveys) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    return ok(await this.loadSurveys.load())
  }
}
