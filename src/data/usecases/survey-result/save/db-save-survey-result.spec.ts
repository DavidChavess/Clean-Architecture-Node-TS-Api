import { SaveSurveyResultRepository } from './db-save-survey-result.protocols'
import { DbSaveSurveyResult } from './db-save-survey-result'
import MockDate from 'mockdate'
import { mockSaveSurveyResultRepository } from '@/data/test'
import { mockSaveSurveyResultParams, mockSurveyResultModel } from '@/domain/test'

describe('DbSaveSurveyResult Usecase', () => {
  let _sut: DbSaveSurveyResult
  let _saveSurveyResultRepositoryStub: SaveSurveyResultRepository

  beforeAll(async () => {
    MockDate.set(new Date())
  })

  afterAll(async () => {
    MockDate.reset()
  })

  beforeEach(() => {
    _saveSurveyResultRepositoryStub = mockSaveSurveyResultRepository()
    _sut = new DbSaveSurveyResult(_saveSurveyResultRepositoryStub)
  })

  test('Should call SaveSurveyResultRepository with correct values', async () => {
    const saveSurveyResultRepoSpy = jest.spyOn(_saveSurveyResultRepositoryStub, 'save')
    await _sut.save(mockSaveSurveyResultParams())
    expect(saveSurveyResultRepoSpy).toHaveBeenCalledWith(mockSaveSurveyResultParams())
  })

  test('Should return SurveyResultModel on success', async () => {
    const survey = await _sut.save(mockSaveSurveyResultParams())
    expect(survey).toEqual(mockSurveyResultModel())
  })

  test('Should throws if SaveSurveyResultRepository throw', async () => {
    jest.spyOn(_saveSurveyResultRepositoryStub, 'save').mockRejectedValueOnce(new Error())
    const promise = _sut.save(mockSaveSurveyResultParams())
    await expect(promise).rejects.toThrow(new Error())
  })
})
