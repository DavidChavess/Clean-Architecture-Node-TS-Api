import { LoadSurveysController } from '@/presentation/controllers'
import { LoadSurveys } from '@/domain/usecases'
import { HttpRequest } from '@/presentation/protocols'
import { noContent, ok, serverError, unauthorized } from '@/presentation/helpers'
import { mockLoadSurvey } from '@/tests/presentation/mocks'
import { mockSurveyModels } from '@/tests/domain/mocks'
import MockDate from 'mockdate'

const makeHttpRequest = (): HttpRequest => ({ accountId: 'any_account_id' })

describe('LoadSurvey Controller', () => {
  let _loadSurveysStub: LoadSurveys
  let _sut: LoadSurveysController

  beforeEach(() => {
    _loadSurveysStub = mockLoadSurvey()
    _sut = new LoadSurveysController(_loadSurveysStub)
  })

  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.set(new Date())
  })

  test('Should call LoadSurveys with correct values', async () => {
    const loadSurveysSpy = jest.spyOn(_loadSurveysStub, 'load')
    await _sut.handle(makeHttpRequest())
    expect(loadSurveysSpy).toHaveBeenCalledWith('any_account_id')
  })

  test('Should return 200 on LoadSurveys on success', async () => {
    const httpResponse = await _sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(ok(mockSurveyModels()))
  })

  test('Should return 204 if LoadSurveys returns empty', async () => {
    jest.spyOn(_loadSurveysStub, 'load').mockResolvedValueOnce([])
    const httpResponse = await _sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(noContent())
  })

  test('Should return 401 if accountId is no provided', async () => {
    const httpResponse = await _sut.handle({})
    expect(httpResponse).toEqual(unauthorized())
  })

  test('Should return 500 if LoadSurveys throws', async () => {
    jest.spyOn(_loadSurveysStub, 'load').mockRejectedValueOnce(new Error('any_error'))
    const httpResponse = await _sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(serverError(new Error('any_error')))
  })
})
