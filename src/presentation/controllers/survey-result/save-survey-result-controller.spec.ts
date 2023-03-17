import { HttpRequest, SurveyModel, LoadSurveyById } from './save-survey-result-controller-protocols'
import { SaveSurveyResultController } from './save-survey-result-controller'

const makeFakeSurvey = (): SurveyModel => ({
  id: 'any_id',
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }],
  date: new Date()
})

const makeFakeRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_id'
  }
})

class LoadSurveyByIdStub implements LoadSurveyById {
  async loadById (id: string): Promise<SurveyModel> {
    return makeFakeSurvey()
  }
}

describe('SaveSurveuResult Controller', () => {
  let _sut: SaveSurveyResultController
  let _loadSurveyByIdStub: LoadSurveyByIdStub

  beforeEach(() => {
    _loadSurveyByIdStub = new LoadSurveyByIdStub()
    _sut = new SaveSurveyResultController(_loadSurveyByIdStub)
  })

  test('Should call LoadSurveyById with correct values', async () => {
    const loadSurveyByIdSpy = jest.spyOn(_loadSurveyByIdStub, 'loadById')
    await _sut.handle(makeFakeRequest())
    expect(loadSurveyByIdSpy).toHaveBeenCalledWith('any_id')
  })
})
