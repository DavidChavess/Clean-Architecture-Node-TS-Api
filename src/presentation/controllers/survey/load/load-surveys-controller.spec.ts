import { LoadSurveysController } from './load-surveys-controller'
import { LoadSurveys, SurveyModel, ok } from './load-surveys-protocols'
import MockDate from 'mockdate'

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

class LoadSurveyStub implements LoadSurveys {
  async load (): Promise<SurveyModel[]> {
    return makeSurveys()
  }
}

describe('LoadSurvey Controller', () => {
  let _loadSurveysStub: LoadSurveyStub
  let _sut: LoadSurveysController

  beforeEach(() => {
    _loadSurveysStub = new LoadSurveyStub()
    _sut = new LoadSurveysController(_loadSurveysStub)
  })

  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.set(new Date())
  })

  test('should call LoadSurveys with correct values', async () => {
    const loadSurveysSpy = jest.spyOn(_loadSurveysStub, 'load')
    await _sut.handle({})
    expect(loadSurveysSpy).toHaveBeenCalled()
  })

  test('should return 200 on loadSurveys on success', async () => {
    const httpResponse = await _sut.handle({})
    expect(httpResponse).toEqual(ok(makeSurveys()))
  })
})
