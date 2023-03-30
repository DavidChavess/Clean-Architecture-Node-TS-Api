import { InvalidParamError } from '@/presentation/errors'
import { Controller, HttpRequest, HttpResponse, LoadSurveyById, SaveSurveyResult } from './save-survey-result-controller-protocols'
import { forbidden, ok, serverError, unauthorized } from '@/presentation/helpers/http/http-helper'

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyById: LoadSurveyById,
    private readonly saveSurveyResult: SaveSurveyResult
  ) {}

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

      const saveSurveyResult = await this.saveSurveyResult.save({
        accountId,
        surveyId,
        answer,
        date: new Date()
      })

      return ok(saveSurveyResult)
    } catch (error) {
      return serverError(error)
    }
  }
}
