import { DbLoadSurveyResult } from '@/data/usecases'
import { mockLoadSurveyResultParams, mockSurveyResultModel } from '@/tests/domain/mocks'
import { LoadSurveyResultRepositorySpy, LoadSurveyByIdRepositorySpy } from '@/tests/data/mocks'
import MockDate from 'mockdate'

describe('DbLoadSurveyResult Usecase', () => {
  let _loadSurveyResultRepositorySpy: LoadSurveyResultRepositorySpy
  let _loadSurveyByIdRepositorySpy: LoadSurveyByIdRepositorySpy
  let _sut: DbLoadSurveyResult

  beforeAll(async () => {
    MockDate.set(new Date())
  })

  afterAll(async () => {
    MockDate.reset()
  })
  beforeEach(() => {
    _loadSurveyResultRepositorySpy = new LoadSurveyResultRepositorySpy()
    _loadSurveyByIdRepositorySpy = new LoadSurveyByIdRepositorySpy()
    _sut = new DbLoadSurveyResult(_loadSurveyResultRepositorySpy, _loadSurveyByIdRepositorySpy)
  })

  test('Should call LoadSurveyResultRepository with correct survey id', async () => {
    const loadSurveyResultParams = mockLoadSurveyResultParams()
    await _sut.load(loadSurveyResultParams)
    expect(_loadSurveyResultRepositorySpy.params.accountId).toBe(loadSurveyResultParams.accountId)
    expect(_loadSurveyResultRepositorySpy.params.surveyId).toBe(loadSurveyResultParams.surveyId)
  })

  test('Should throw if LoadSurveyResultRepository throws', async () => {
    jest.spyOn(_loadSurveyResultRepositorySpy, 'loadBySurveyId').mockRejectedValueOnce(new Error('any_error'))
    const promise = _sut.load(mockLoadSurveyResultParams())
    await expect(promise).rejects.toThrowError('any_error')
  })

  test('Should call LoadSurveyByIdRepository if LoadSurveyResultRepository returns null', async () => {
    _loadSurveyResultRepositorySpy.result = null
    const loadSurveyResultParams = mockLoadSurveyResultParams()
    await _sut.load(loadSurveyResultParams)
    expect(_loadSurveyByIdRepositorySpy.id).toBe(loadSurveyResultParams.surveyId)
  })

  test('Should return survey result with all answers with count 0 if LoadSurveyResultRepository returns null', async () => {
    _loadSurveyResultRepositorySpy.result = null
    const surveyResult = await _sut.load(mockLoadSurveyResultParams())
    expect(surveyResult).toEqual(mockSurveyResultModel())
  })

  test('Should return a survey result on success', async () => {
    const surveyResult = await _sut.load(mockLoadSurveyResultParams())
    expect(surveyResult).toEqual(mockSurveyResultModel())
  })
})
