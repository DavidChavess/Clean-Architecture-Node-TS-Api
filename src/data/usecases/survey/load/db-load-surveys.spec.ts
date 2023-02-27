import { DbLoadSurveys } from './db-load-surveys'
import { LoadSurveysRepository, SurveyModel } from './db-load-surveys-protocols'

const makeSurveys = (): SurveyModel[] => ([
  {
    id: '1',
    question: 'question 1',
    date: new Date(),
    answers: [{ answer: 'any_answer' }]
  },
  {
    id: '2',
    question: 'question 2',
    date: new Date(),
    answers: [{ answer: 'any_answer' }]
  }
])

class LoadSurveysRepositoryStub implements LoadSurveysRepository {
  async loadAll (): Promise<SurveyModel[]> {
    return makeSurveys()
  }
}

describe('DbLoadSurveys Usecase', () => {
  let _sut: DbLoadSurveys
  let _loadSurveysRepositoryStub: LoadSurveysRepositoryStub

  beforeEach(() => {
    _loadSurveysRepositoryStub = new LoadSurveysRepositoryStub()
    _sut = new DbLoadSurveys(_loadSurveysRepositoryStub)
  })

  test('Should call LoadSurveysRepository', async () => {
    const spyLoadSurveysRepository = jest.spyOn(_loadSurveysRepositoryStub, 'loadAll')
    await _sut.load()
    expect(spyLoadSurveysRepository).toHaveBeenCalled()
  })

  test('Should return a list of Surveys on success', async () => {
    const surveys = await _sut.load()
    expect(surveys).toEqual(makeSurveys())
  })

  test('Should throws if LoadSurveysRepository throw', async () => {
    jest.spyOn(_loadSurveysRepositoryStub, 'loadAll').mockRejectedValueOnce(new Error())
    const promise = _sut.load()
    await expect(promise).rejects.toThrow(new Error())
  })
})
