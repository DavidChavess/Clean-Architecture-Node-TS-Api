import { LoadSurveys } from '@/domain/usecases'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { unauthorized, noContent, ok, serverError } from '@/presentation/helpers'

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
