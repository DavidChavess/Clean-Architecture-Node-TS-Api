import { SaveSurveyResultController } from '@/presentation/controllers'
import { LoadAnswersBySurvey, SaveSurveyResult } from '@/domain/usecases'
import { forbidden, serverError, unauthorized, ok } from '@/presentation/helpers'
import { InvalidParamError } from '@/presentation/errors'
import { mockLoadAnswersBySurvey, mockSaveSurveyResult } from '@/tests/presentation/mocks'
import { mockSaveSurveyResultParams, mockSurveyResultModel } from '@/tests/domain/mocks'
import MockDate from 'mockdate'

const mockRequest = (): SaveSurveyResultController.Request => ({
  surveyId: 'any_survey_id',
  answer: 'any_answer',
  accountId: 'any_account_id'
})

describe('SaveSurveyResult Controller', () => {
  let _sut: SaveSurveyResultController
  let _loadAnswersBySurveyStub: LoadAnswersBySurvey
  let _saveSurveyResultStub: SaveSurveyResult

  beforeEach(() => {
    _loadAnswersBySurveyStub = mockLoadAnswersBySurvey()
    _saveSurveyResultStub = mockSaveSurveyResult()
    _sut = new SaveSurveyResultController(_loadAnswersBySurveyStub, _saveSurveyResultStub)
  })

  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.set(new Date())
  })

  test('Should call LoadAnswersBySurvey with correct values', async () => {
    const loadSurveyByIdSpy = jest.spyOn(_loadAnswersBySurveyStub, 'loadAnswers')
    await _sut.handle(mockRequest())
    expect(loadSurveyByIdSpy).toHaveBeenCalledWith('any_survey_id')
  })

  test('Should return 403 if LoadAnswersBySurvey returns empty', async () => {
    jest.spyOn(_loadAnswersBySurveyStub, 'loadAnswers').mockResolvedValueOnce([])
    const httpResponse = await _sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  test('Should return 500 if LoadAnswersBySurvey throws', async () => {
    jest.spyOn(_loadAnswersBySurveyStub, 'loadAnswers').mockRejectedValueOnce(new Error('any_error'))
    const httpResponse = await _sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error('any_error')))
  })

  test('Should return 403 if an invalid answer is provided', async () => {
    const httpResponse = await _sut.handle({
      surveyId: 'any_survey_id',
      answer: 'other_answer',
      accountId: 'any_account_id'
    })
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')))
  })

  test('Should return 401 if accountId is not provided', async () => {
    const httpResponse = await _sut.handle({
      surveyId: 'any_id',
      answer: 'any_answer',
      accountId: ''
    })
    expect(httpResponse).toEqual(unauthorized())
  })

  test('Should call SaveSurveyResult with correct values', async () => {
    const saveSurveySpy = jest.spyOn(_saveSurveyResultStub, 'save')
    await _sut.handle(mockRequest())
    expect(saveSurveySpy).toHaveBeenCalledWith(mockSaveSurveyResultParams())
  })

  test('Should return 500 if SaveSurveyResult throws', async () => {
    jest.spyOn(_saveSurveyResultStub, 'save').mockRejectedValueOnce(new Error('any_error'))
    const httpResponse = await _sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error('any_error')))
  })

  test('Should returns 200 on success', async () => {
    const httpResponse = await _sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok(mockSurveyResultModel()))
  })
})
