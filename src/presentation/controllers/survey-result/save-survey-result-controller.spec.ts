import { HttpRequest, SurveyModel, LoadSurveyById } from './save-survey-result-controller-protocols'
import { SaveSurveyResultController } from './save-survey-result-controller'
import { forbidden, serverError, unauthorized } from '../survey/load/load-surveys-protocols'
import { InvalidParamError } from '@/presentation/errors'

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
  },
  body: {
    answer: 'any_answer'
  },
  accountId: 'any_account_id'
})

class LoadSurveyByIdStub implements LoadSurveyById {
  async loadById (id: string): Promise<SurveyModel | null> {
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

  test('Should returns 403 if LoadSurveyById returns null', async () => {
    jest.spyOn(_loadSurveyByIdStub, 'loadById').mockResolvedValueOnce(null)
    const httpResponse = await _sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  test('Should returns 500 if LoadSurveyById throws', async () => {
    jest.spyOn(_loadSurveyByIdStub, 'loadById').mockRejectedValueOnce(new Error('any_error'))
    const httpResponse = await _sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error('any_error')))
  })

  test('Should returns 403 if an invalid answer is provided', async () => {
    const httpResponse = await _sut.handle({
      params: {
        surveyId: 'any_id'
      },
      body: {
        answer: 'other_answer'
      },
      accountId: 'any_account_id'
    })
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')))
  })

  test('Should returns 401 if accountId is not provided', async () => {
    const httpResponse = await _sut.handle({
      params: {
        surveyId: 'any_id'
      },
      body: {
        answer: 'any_answer'
      }
    })
    expect(httpResponse).toEqual(unauthorized())
  })
})
