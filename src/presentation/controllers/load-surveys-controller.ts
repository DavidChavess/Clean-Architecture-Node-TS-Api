import { LoadSurveys } from '@/domain/usecases'
import { Controller, HttpResponse } from '@/presentation/protocols'
import { unauthorized, noContent, ok, serverError } from '@/presentation/helpers'

export class LoadSurveysController implements Controller {
  constructor (private readonly loadSurveys: LoadSurveys) {}

  async handle (request: LoadSurveysController.Request): Promise<HttpResponse> {
    try {
      const { accountId } = request
      if (!accountId) return unauthorized()

      const surveys = await this.loadSurveys.load(accountId)
      return surveys.length === 0 ? noContent() : ok(surveys)
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace LoadSurveysController {
  export type Request = {
    accountId: string
  }
}
