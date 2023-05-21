import {
  Controller,
  HttpRequest,
  HttpResponse,
  noContent,
  ok,
  serverError,
  LoadSurveys,
  unauthorized
} from './load-surveys-protocols'

export class LoadSurveysController implements Controller {
  constructor (private readonly loadSurveys: LoadSurveys) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { accountId } = httpRequest
      if (!accountId) return unauthorized()

      const surveys = await this.loadSurveys.load(accountId)
      return surveys.length === 0 ? noContent() : ok(surveys)
    } catch (error) {
      return serverError(error)
    }
  }
}
