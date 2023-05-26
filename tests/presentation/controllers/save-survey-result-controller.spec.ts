import { SaveSurveyResultController } from '@/presentation/controllers'
import { LoadSurveyById, SaveSurveyResult } from '@/domain/usecases'
import { HttpRequest } from '@/presentation/protocols'
import { forbidden, serverError, unauthorized, ok } from '@/presentation/helpers'
import { InvalidParamError } from '@/presentation/errors'
import { mockLoadSurveyById, mockSaveSurveyResult } from '@/tests/presentation/mocks'
import { mockSaveSurveyResultParams, mockSurveyResultModel } from '@/tests/domain/mocks'
import MockDate from 'mockdate'

const makeFakeRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_survey_id'
  },
  body: {
    answer: 'any_answer'
  },
  accountId: 'any_account_id'
})

describe('SaveSurveuResult Controller', () => {
  let _sut: SaveSurveyResultController
  let _loadSurveyByIdStub: LoadSurveyById
  let _saveSurveyResultStub: SaveSurveyResult

  beforeEach(() => {
    _loadSurveyByIdStub = mockLoadSurveyById()
    _saveSurveyResultStub = mockSaveSurveyResult()
    _sut = new SaveSurveyResultController(_loadSurveyByIdStub, _saveSurveyResultStub)
  })

  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.set(new Date())
  })

  test('Should call LoadSurveyById with correct values', async () => {
    const loadSurveyByIdSpy = jest.spyOn(_loadSurveyByIdStub, 'loadById')
    await _sut.handle(makeFakeRequest())
    expect(loadSurveyByIdSpy).toHaveBeenCalledWith('any_survey_id')
  })

  test('Should return 403 if LoadSurveyById returns null', async () => {
    jest.spyOn(_loadSurveyByIdStub, 'loadById').mockResolvedValueOnce(null)
    const httpResponse = await _sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  test('Should return 500 if LoadSurveyById throws', async () => {
    jest.spyOn(_loadSurveyByIdStub, 'loadById').mockRejectedValueOnce(new Error('any_error'))
    const httpResponse = await _sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error('any_error')))
  })

  test('Should return 403 if an invalid answer is provided', async () => {
    const httpResponse = await _sut.handle({
      params: {
        surveyId: 'any_survey_id'
      },
      body: {
        answer: 'other_answer'
      },
      accountId: 'any_account_id'
    })
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')))
  })

  test('Should return 401 if accountId is not provided', async () => {
    const httpResponse = await _sut.handle({
      params: {
        surveyId: 'any_id'
      },
      body: {
        answer: 'any_answer'
      }
    })
    expect(httpResponse).toEqual(unauthorized())
  })

  test('Should call SaveSurveyResult with correct values', async () => {
    const saveSurveySpy = jest.spyOn(_saveSurveyResultStub, 'save')
    await _sut.handle(makeFakeRequest())
    expect(saveSurveySpy).toHaveBeenCalledWith(mockSaveSurveyResultParams())
  })

  test('Should return 500 if SaveSurveyResult throws', async () => {
    jest.spyOn(_saveSurveyResultStub, 'save').mockRejectedValueOnce(new Error('any_error'))
    const httpResponse = await _sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error('any_error')))
  })

  test('Should returns 200 on success', async () => {
    const httpResponse = await _sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok(mockSurveyResultModel()))
  })
})
