import { DbSaveSurveyResult } from '@/data/usecases'
import { SaveSurveyResultRepositorySpy, LoadSurveyResultRepositorySpy } from '@/tests/data/mocks'
import { mockSaveSurveyResultParams, mockSurveyResultModel } from '@/tests/domain/mocks'
import MockDate from 'mockdate'

describe('DbSaveSurveyResult Usecase', () => {
  let _sut: DbSaveSurveyResult
  let _saveSurveyResultRepositorySpy: SaveSurveyResultRepositorySpy
  let _loadSurveyResultRepositorySpy: LoadSurveyResultRepositorySpy

  beforeAll(async () => {
    MockDate.set(new Date())
  })

  afterAll(async () => {
    MockDate.reset()
  })

  beforeEach(() => {
    _saveSurveyResultRepositorySpy = new SaveSurveyResultRepositorySpy()
    _loadSurveyResultRepositorySpy = new LoadSurveyResultRepositorySpy()
    _sut = new DbSaveSurveyResult(_saveSurveyResultRepositorySpy, _loadSurveyResultRepositorySpy)
  })

  test('Should call SaveSurveyResultRepository with correct values', async () => {
    const saveSurveyResult = mockSaveSurveyResultParams()
    await _sut.save(saveSurveyResult)
    expect(_saveSurveyResultRepositorySpy.params).toEqual({ ...saveSurveyResult })
  })

  test('Should throws if SaveSurveyResultRepository throw', async () => {
    jest.spyOn(_saveSurveyResultRepositorySpy, 'save').mockRejectedValueOnce(new Error())
    const promise = _sut.save(mockSaveSurveyResultParams())
    await expect(promise).rejects.toThrow(new Error())
  })

  test('Should call LoadSurveyResultRepository with correct values', async () => {
    const saveSurveyResult = mockSaveSurveyResultParams()
    await _sut.save(saveSurveyResult)
    expect(_loadSurveyResultRepositorySpy.params.accountId).toBe(saveSurveyResult.accountId)
    expect(_loadSurveyResultRepositorySpy.params.surveyId).toBe(saveSurveyResult.surveyId)
  })

  test('Should throws id LoadSurveyResultRepository throws', async () => {
    jest.spyOn(_loadSurveyResultRepositorySpy, 'loadBySurveyId').mockRejectedValueOnce(new Error())
    const promise = _sut.save(mockSaveSurveyResultParams())
    await expect(promise).rejects.toThrow(new Error())
  })

  test('Should return SurveyResultModel on success', async () => {
    const survey = await _sut.save(mockSaveSurveyResultParams())
    expect(survey).toEqual(mockSurveyResultModel())
  })
})
