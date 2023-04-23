import { mockLoadSurveyResultRepository } from '@/data/test'
import { DbLoadSurveyResult } from './db-load-survey-result'
import { LoadSurveyResultRepository } from './db-load-survey-result-protocols'

describe('DbLoadSurveyResult Usecase', () => {
  let _loadSurveyResultRepositoryStub: LoadSurveyResultRepository
  let _sut: DbLoadSurveyResult

  beforeEach(() => {
    _loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository()
    _sut = new DbLoadSurveyResult(_loadSurveyResultRepositoryStub)
  })

  test('Should call loadSurveyRepository with correct survey id', async () => {
    const loadSpy = jest.spyOn(_loadSurveyResultRepositoryStub, 'loadBySurveyId')
    await _sut.load('any_survey_id')
    expect(loadSpy).toHaveBeenCalledWith('any_survey_id')
  })
})
