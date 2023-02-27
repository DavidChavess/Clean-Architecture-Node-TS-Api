import { LoadSurveysController } from './load-surveys-controller'
import { LoadSurveys, SurveyModel, noContent, ok, serverError } from './load-surveys-protocols'
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

  test('Should call LoadSurveys with correct values', async () => {
    const loadSurveysSpy = jest.spyOn(_loadSurveysStub, 'load')
    await _sut.handle({})
    expect(loadSurveysSpy).toHaveBeenCalled()
  })

  test('Should return 200 on LoadSurveys on success', async () => {
    const httpResponse = await _sut.handle({})
    expect(httpResponse).toEqual(ok(makeSurveys()))
  })

  test('Should return 204 if LoadSurveys returns empty', async () => {
    jest.spyOn(_loadSurveysStub, 'load').mockResolvedValueOnce([])
    const httpResponse = await _sut.handle({})
    expect(httpResponse).toEqual(noContent())
  })

  test('Should return 500 if LoadSurveys throws', async () => {
    jest.spyOn(_loadSurveysStub, 'load').mockRejectedValueOnce(new Error('any_error'))
    const httpResponse = await _sut.handle({})
    expect(httpResponse).toEqual(serverError(new Error('any_error')))
  })
})
