import { LoadSurveyResultController } from '@/presentation/controllers'
import { CheckSurveyById, LoadSurveyResult } from '@/domain/usecases'
import { forbidden, ok, serverError } from '@/presentation/helpers'
import { InvalidParamError } from '@/presentation/errors'
import { mockCheckSurveyById, mockLoadSurveyResult } from '@/tests/presentation/mocks'
import { mockLoadSurveyResultParams, mockSurveyResultModel } from '@/tests/domain/mocks'
import MockDate from 'mockdate'

const mockRequest = (): LoadSurveyResultController.Request => ({
  accountId: 'any_account_id',
  surveyId: 'any_survey_id'
})

describe('LoadSurveyResult Controller', () => {
  let _checkSurveyByIdStub: CheckSurveyById
  let _loadSurveyResultStub: LoadSurveyResult
  let _sut: LoadSurveyResultController

  beforeEach(() => {
    _checkSurveyByIdStub = mockCheckSurveyById()
    _loadSurveyResultStub = mockLoadSurveyResult()
    _sut = new LoadSurveyResultController(_checkSurveyByIdStub, _loadSurveyResultStub)
  })

  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.set(new Date())
  })

  test('Should call CheckSurveyById with correct surveyId', async () => {
    const checkSpy = jest.spyOn(_checkSurveyByIdStub, 'checkById')
    await _sut.handle(mockRequest())
    expect(checkSpy).toHaveBeenCalledWith('any_survey_id')
  })

  test('Should return 403 if CheckSurveyById returns false', async () => {
    jest.spyOn(_checkSurveyByIdStub, 'checkById').mockResolvedValueOnce(false)
    const httpResponse = await _sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  test('Should return 500 if CheckSurveyById throws', async () => {
    jest.spyOn(_checkSurveyByIdStub, 'checkById').mockRejectedValueOnce(new Error())
    const httpResponse = await _sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should call LoadSurveyResult with correct values', async () => {
    const loadSpy = jest.spyOn(_loadSurveyResultStub, 'load')
    await _sut.handle(mockRequest())
    expect(loadSpy).toHaveBeenCalledWith(mockLoadSurveyResultParams())
  })

  test('Should return 500 if LoadSurveyResult throws', async () => {
    jest.spyOn(_loadSurveyResultStub, 'load').mockRejectedValueOnce(new Error())
    const httpResponse = await _sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 200 on success', async () => {
    const httpResponse = await _sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok(mockSurveyResultModel()))
  })
})
