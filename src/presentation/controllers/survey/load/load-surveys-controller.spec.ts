import { LoadSurveysController } from './load-surveys-controller'
import { LoadSurveys, noContent, ok, serverError } from './load-surveys-protocols'
import MockDate from 'mockdate'
import { mockLoadSurvey } from '@/presentation/test'
import { mockSurveyModels } from '@/domain/test'

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
    await _sut.handle({})
    expect(loadSurveysSpy).toHaveBeenCalled()
  })

  test('Should return 200 on LoadSurveys on success', async () => {
    const httpResponse = await _sut.handle({})
    expect(httpResponse).toEqual(ok(mockSurveyModels()))
  })

  test('Should return 204 if LoadSurveys returns empty', async () => {
    jest.spyOn(_loadSurveysStub, 'load').mockResolvedValueOnce([])
    const httpResponse = await _sut.handle({})
    expect(httpResponse).toEqual(noContent())
  })

  test('Should return 500 if LoadSurveys throws', async () => {
    jest.spyOn(_loadSurveysStub, 'load').mockRejectedValueOnce(new Error('any_error'))
    const httpResponse = await _sut.handle({})
    expect(httpResponse).toEqual(serverError(new Error('any_error')))
  })
})
