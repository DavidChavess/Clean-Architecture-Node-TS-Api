import { LoadSurveyResultController } from '@/presentation/controllers'
import { LoadSurveyById, LoadSurveyResult } from '@/domain/usecases'
import { HttpRequest } from '@/presentation/protocols'
import { forbidden, ok, serverError } from '@/presentation/helpers'
import { InvalidParamError } from '@/presentation/errors'
import { mockLoadSurveyById, mockLoadSurveyResult } from '@/tests/presentation/mocks'
import { mockLoadSurveyResultParams, mockSurveyResultModel } from '@/tests/domain/mocks'
import MockDate from 'mockdate'

const makeHttpRequest = (): HttpRequest => ({
  accountId: 'any_account_id',
  params: {
    surveyId: 'any_survey_id'
  }
})

describe('LoadSurveyResult Controller', () => {
  let _loadSurveyByIdStub: LoadSurveyById
  let _loadSurveyResultStub: LoadSurveyResult
  let _sut: LoadSurveyResultController

  beforeEach(() => {
    _loadSurveyByIdStub = mockLoadSurveyById()
    _loadSurveyResultStub = mockLoadSurveyResult()
    _sut = new LoadSurveyResultController(_loadSurveyByIdStub, _loadSurveyResultStub)
  })

  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.set(new Date())
  })

  test('Should call LoadSurveyById with correct surveyId', async () => {
    const loadSpy = jest.spyOn(_loadSurveyByIdStub, 'loadById')
    await _sut.handle(makeHttpRequest())
    expect(loadSpy).toHaveBeenCalledWith('any_survey_id')
  })

  test('Should return 403 if LoadSurveyById returns null', async () => {
    jest.spyOn(_loadSurveyByIdStub, 'loadById').mockResolvedValueOnce(null)
    const httpResponse = await _sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  test('Should return 500 if LoadSurveyById throws', async () => {
    jest.spyOn(_loadSurveyByIdStub, 'loadById').mockRejectedValueOnce(new Error())
    const httpResponse = await _sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should call LoadSurveyResult with correct values', async () => {
    const loadSpy = jest.spyOn(_loadSurveyResultStub, 'load')
    await _sut.handle(makeHttpRequest())
    expect(loadSpy).toHaveBeenCalledWith(mockLoadSurveyResultParams())
  })

  test('Should return 500 if LoadSurveyResult throws', async () => {
    jest.spyOn(_loadSurveyResultStub, 'load').mockRejectedValueOnce(new Error())
    const httpResponse = await _sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 200 on success', async () => {
    const httpResponse = await _sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(ok(mockSurveyResultModel()))
  })
})
