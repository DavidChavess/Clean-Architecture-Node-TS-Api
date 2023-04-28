import { mockLoadSurveyById, mockLoadSurveyResult } from '@/presentation/test'
import { LoadSurveyResultController } from './load-survey-result-controller'
import { LoadSurveyById, LoadSurveyResult } from './load-survey-result-controller-protocols'
import { forbidden, serverError } from '@/presentation/helpers/http/http-helper'
import { InvalidParamError } from '@/presentation/errors'

describe('LoadSurveyResult Controller', () => {
  let _loadSurveyByIdStub: LoadSurveyById
  let _loadSurveyResultStub: LoadSurveyResult
  let _sut: LoadSurveyResultController

  beforeEach(() => {
    _loadSurveyByIdStub = mockLoadSurveyById()
    _loadSurveyResultStub = mockLoadSurveyResult()
    _sut = new LoadSurveyResultController(_loadSurveyByIdStub, _loadSurveyResultStub)
  })

  test('Should call LoadSurveyById with correct survey id', async () => {
    const loadSpy = jest.spyOn(_loadSurveyByIdStub, 'loadById')
    await _sut.handle({ params: { surveyId: 'any_survey_id' } })
    expect(loadSpy).toHaveBeenCalledWith('any_survey_id')
  })

  test('Should return 403 if LoadSurveyById returns null', async () => {
    jest.spyOn(_loadSurveyByIdStub, 'loadById').mockResolvedValueOnce(null)
    const httpResponse = await _sut.handle({ params: { surveyId: 'any_survey_id' } })
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  test('Should return 500 if LoadSurveyById throws', async () => {
    jest.spyOn(_loadSurveyByIdStub, 'loadById').mockRejectedValueOnce(new Error())
    const httpResponse = await _sut.handle({ params: { surveyId: 'any_survey_id' } })
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should call LoadSurveyResult with correct values', async () => {
    const loadSpy = jest.spyOn(_loadSurveyResultStub, 'load')
    await _sut.handle({ params: { surveyId: 'any_survey_id' } })
    expect(loadSpy).toHaveBeenCalledWith('any_survey_id')
  })

  test('Should return 500 if LoadSurveyResult throws', async () => {
    jest.spyOn(_loadSurveyResultStub, 'load').mockRejectedValueOnce(new Error())
    const httpResponse = await _sut.handle({ params: { surveyId: 'any_survey_id' } })
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
