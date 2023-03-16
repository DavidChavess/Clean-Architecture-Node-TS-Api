import { SaveSurveyResultModel, SurveyResultModel, SaveSurveyResultRepository } from './db-save-survey-result.protocols'
import { DbSaveSurveyResult } from './db-save-survey-result'
import MockDate from 'mockdate'

const makeSaveSurveyResultModel = (): SaveSurveyResultModel => ({
  surveyId: '1',
  accountId: '1',
  answer: 'any_answer',
  date: new Date()
})

const makeSurveyResultModel = (): SurveyResultModel => Object.assign({}, makeSaveSurveyResultModel(), {
  id: '1'
})

class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
  async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
    return makeSurveyResultModel()
  }
}

describe('DbSaveSurveyResult Usecase', () => {
  let _sut: DbSaveSurveyResult
  let _loadSurveyByIdRepositoryStub: SaveSurveyResultRepositoryStub

  beforeAll(async () => {
    MockDate.set(new Date())
  })

  afterAll(async () => {
    MockDate.reset()
  })

  beforeEach(() => {
    _loadSurveyByIdRepositoryStub = new SaveSurveyResultRepositoryStub()
    _sut = new DbSaveSurveyResult(_loadSurveyByIdRepositoryStub)
  })

  test('Should call SaveSurveyResultRepository with correct values', async () => {
    const saveSurveyResultRepoSpy = jest.spyOn(_loadSurveyByIdRepositoryStub, 'save')
    await _sut.save(makeSaveSurveyResultModel())
    expect(saveSurveyResultRepoSpy).toHaveBeenCalledWith(makeSaveSurveyResultModel())
  })
})
