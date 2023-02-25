import { Controller, HttpRequest, HttpResponse } from '../../../protocols'
import { LoadSurveys, ok, serverError } from './load-surveys-protocols'

export class LoadSurveysController implements Controller {
  constructor (private readonly loadSurveys: LoadSurveys) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      return ok(await this.loadSurveys.load())
    } catch (error) {
      return serverError(error)
    }
  }
}
