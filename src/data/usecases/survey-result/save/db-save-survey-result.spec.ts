import { SaveSurveyResultRepository, LoadSurveyResultRepository } from './db-save-survey-result.protocols'
import { DbSaveSurveyResult } from './db-save-survey-result'
import MockDate from 'mockdate'
import { mockLoadSurveyResultRepository, mockSaveSurveyResultRepository } from '@/data/test'
import { mockLoadSurveyResultParams, mockSaveSurveyResultParams, mockSurveyResultModel } from '@/domain/test'

describe('DbSaveSurveyResult Usecase', () => {
  let _sut: DbSaveSurveyResult
  let _saveSurveyResultRepositoryStub: SaveSurveyResultRepository
  let _loadSurveyResultRepositoryStub: LoadSurveyResultRepository

  beforeAll(async () => {
    MockDate.set(new Date())
  })

  afterAll(async () => {
    MockDate.reset()
  })

  beforeEach(() => {
    _saveSurveyResultRepositoryStub = mockSaveSurveyResultRepository()
    _loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository()
    _sut = new DbSaveSurveyResult(_saveSurveyResultRepositoryStub, _loadSurveyResultRepositoryStub)
  })

  test('Should call SaveSurveyResultRepository with correct values', async () => {
    const saveSurveyResultRepoSpy = jest.spyOn(_saveSurveyResultRepositoryStub, 'save')
    await _sut.save(mockSaveSurveyResultParams())
    expect(saveSurveyResultRepoSpy).toHaveBeenCalledWith(mockSaveSurveyResultParams())
  })

  test('Should throws if SaveSurveyResultRepository throw', async () => {
    jest.spyOn(_saveSurveyResultRepositoryStub, 'save').mockRejectedValueOnce(new Error())
    const promise = _sut.save(mockSaveSurveyResultParams())
    await expect(promise).rejects.toThrow(new Error())
  })

  test('Should call LoadSurveyResultRepository with correct values', async () => {
    const loadSurveyResultRepoSpy = jest.spyOn(_loadSurveyResultRepositoryStub, 'loadBySurveyId')
    await _sut.save(mockSaveSurveyResultParams())
    expect(loadSurveyResultRepoSpy).toHaveBeenCalledWith(mockLoadSurveyResultParams())
  })

  test('Should throws id LoadSurveyResultRepository throws', async () => {
    jest.spyOn(_loadSurveyResultRepositoryStub, 'loadBySurveyId').mockRejectedValueOnce(new Error())
    const promise = _sut.save(mockSaveSurveyResultParams())
    await expect(promise).rejects.toThrow(new Error())
  })

  test('Should return SurveyResultModel on success', async () => {
    const survey = await _sut.save(mockSaveSurveyResultParams())
    expect(survey).toEqual(mockSurveyResultModel())
  })
})
