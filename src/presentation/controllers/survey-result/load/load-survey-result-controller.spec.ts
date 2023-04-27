import { mockLoadSurveyById } from '@/presentation/test'
import { LoadSurveyResultController } from './load-survey-result-controller'
import { LoadSurveyById } from '@/data/usecases/survey/load-survey-by-id/db-load-survey-by-id-protocols'
import { forbidden } from '@/presentation/helpers/http/http-helper'
import { InvalidParamError } from '@/presentation/errors'

describe('LoadSurveyResult Controller', () => {
  let _loadSurveyById: LoadSurveyById
  let _sut: LoadSurveyResultController

  beforeEach(() => {
    _loadSurveyById = mockLoadSurveyById()
    _sut = new LoadSurveyResultController(_loadSurveyById)
  })

  test('Should call LoadSurveyById with correct survey id', async () => {
    const loadSpy = jest.spyOn(_loadSurveyById, 'loadById')
    await _sut.handle({ params: { surveyId: 'any_survey_id' } })
    expect(loadSpy).toHaveBeenCalledWith('any_survey_id')
  })

  test('Should return 403 if LoadSurveyById returns null', async () => {
    jest.spyOn(_loadSurveyById, 'loadById').mockResolvedValueOnce(null)
    const httpResponse = await _sut.handle({ params: { surveyId: 'any_survey_id' } })
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })
})
