import { DbLoadSurveyResult } from './db-load-survey-result'
import { LoadSurveyResultRepository, LoadSurveyByIdRepository, SurveyResultModel } from './db-load-survey-result-protocols'
import { mockSurveyResultModel } from '@/domain/test'
import { mockLoadSurveyByIdRepository, mockLoadSurveyResultRepository } from '@/data/test'
import MockDate from 'mockdate'
import { mockLoadSurveyById } from '@/presentation/test'

describe('DbLoadSurveyResult Usecase', () => {
  let _loadSurveyResultRepositoryStub: LoadSurveyResultRepository
  let _loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
  let _sut: DbLoadSurveyResult

  beforeAll(async () => {
    MockDate.set(new Date())
  })

  afterAll(async () => {
    MockDate.reset()
  })
  beforeEach(() => {
    _loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository()
    _loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository()
    _sut = new DbLoadSurveyResult(_loadSurveyResultRepositoryStub, _loadSurveyByIdRepositoryStub)
  })

  test('Should call LoadSurveyResultRepository with correct survey id', async () => {
    const loadSpy = jest.spyOn(_loadSurveyResultRepositoryStub, 'loadBySurveyId')
    await _sut.load('any_survey_id')
    expect(loadSpy).toHaveBeenCalledWith('any_survey_id')
  })

  test('Should throw if LoadSurveyResultRepository throws', async () => {
    jest.spyOn(_loadSurveyResultRepositoryStub, 'loadBySurveyId').mockRejectedValueOnce(new Error('any_error'))
    const promise = _sut.load('any_survey_id')
    await expect(promise).rejects.toThrowError('any_error')
  })

  test('Should call LoadSurveyByIdRepository if LoadSurveyResultRepository returns null', async () => {
    jest.spyOn(_loadSurveyResultRepositoryStub, 'loadBySurveyId').mockResolvedValueOnce(null)
    const loadSurveyByIdSpy = jest.spyOn(_loadSurveyByIdRepositoryStub, 'loadById')
    await _sut.load('any_survey_id')
    expect(loadSurveyByIdSpy).toHaveBeenCalledWith('any_survey_id')
  })

  test('Should return survey result with all answers with count 0 if LoadSurveyResultRepository returns null', async () => {
    jest.spyOn(_loadSurveyResultRepositoryStub, 'loadBySurveyId').mockResolvedValueOnce(null)
    const surveyResult = await _sut.load('any_survey_id')
    expect(surveyResult).toEqual(mockSurveyResultModel())
  })

  test('Should return a survey result on success', async () => {
    const surveyResult = await _sut.load('any_survey_id')
    expect(surveyResult).toEqual(mockSurveyResultModel())
  })
})
