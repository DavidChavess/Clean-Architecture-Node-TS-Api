import { LoadSurveysController } from './load-surveys-controller'
import { LoadSurveys, SurveyModel } from './load-surveys-protocols'

class LoadSurveyStub implements LoadSurveys {
  async load (): Promise<SurveyModel[]> {
    return [
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
    ]
  }
}

describe('LoadSurvey Controller', () => {
  let _loadSurveysStub: LoadSurveyStub
  let _sut: LoadSurveysController

  beforeEach(() => {
    _loadSurveysStub = new LoadSurveyStub()
    _sut = new LoadSurveysController(_loadSurveysStub)
  })

  test('should call LoadSurveys with correct values', async () => {
    const loadSurveysSpy = jest.spyOn(_loadSurveysStub, 'load')
    await _sut.handle({})
    expect(loadSurveysSpy).toHaveBeenCalled()
  })
})
