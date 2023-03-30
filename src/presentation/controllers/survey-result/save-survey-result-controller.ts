import { InvalidParamError } from '@/presentation/errors'
import { Controller, HttpRequest, HttpResponse, LoadSurveyById } from './save-survey-result-controller-protocols'
import { forbidden, serverError, unauthorized } from '@/presentation/helpers/http/http-helper'

export class SaveSurveyResultController implements Controller {
  constructor (private readonly loadSurveyById: LoadSurveyById) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params
      const { answer } = httpRequest.body
      const { accountId } = httpRequest

      if (!accountId) {
        return unauthorized()
      }

      const survey = await this.loadSurveyById.loadById(surveyId)
      if (!survey) {
        return forbidden(new InvalidParamError('surveyId'))
      }

      const isValidAnswer = survey.answers.map(answer => answer.answer).includes(answer)
      if (!isValidAnswer) {
        return forbidden(new InvalidParamError('answer'))
      }

      return { statusCode: 200, body: null }
    } catch (error) {
      return serverError(error)
    }
  }
}
