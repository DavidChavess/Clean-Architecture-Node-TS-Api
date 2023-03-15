import { DbLoadSurveyById } from './db-load-survey-by-id'
import { LoadSurveyByIdRepository, SurveyModel } from './db-load-survey-by-id-protocols'
import MockDate from 'mockdate'

const makeSurvey = (): SurveyModel => ({
  id: '1',
  question: 'question 1',
  date: new Date(),
  answers: [{ answer: 'any_answer' }]
})

class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
  async loadById (id: string): Promise<SurveyModel> {
    return makeSurvey()
  }
}

describe('DbLoadSurveyById Usecase', () => {
  let _sut: DbLoadSurveyById
  let _loadSurveyByIdRepositoryStub: LoadSurveyByIdRepositoryStub

  beforeAll(async () => {
    MockDate.set(new Date())
  })

  afterAll(async () => {
    MockDate.reset()
  })

  beforeEach(() => {
    _loadSurveyByIdRepositoryStub = new LoadSurveyByIdRepositoryStub()
    _sut = new DbLoadSurveyById(_loadSurveyByIdRepositoryStub)
  })

  test('Should call LoadSurveyByIdRepository with correct id', async () => {
    const spyLoadSurveyByIdRepo = jest.spyOn(_loadSurveyByIdRepositoryStub, 'loadById')
    await _sut.loadById('any_id')
    expect(spyLoadSurveyByIdRepo).toHaveBeenCalledWith('any_id')
  })

  test('Should return survey on success', async () => {
    const survey = await _sut.loadById('any_id')
    expect(survey).toEqual(makeSurvey())
  })
})
