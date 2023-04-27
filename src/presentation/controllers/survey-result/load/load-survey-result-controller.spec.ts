import { mockLoadSurveyById } from '@/presentation/test'
import { LoadSurveyResultController } from './load-survey-result-controller'

describe('LoadSurveyResult Controller', () => {
  test('Should call LoadSurveyById with correct survey id', async () => {
    const loadSurveyById = mockLoadSurveyById()
    const sut = new LoadSurveyResultController(loadSurveyById)
    const loadSpy = jest.spyOn(loadSurveyById, 'loadById')
    await sut.handle({
      params: {
        surveyId: 'any_survey_id'
      }
    })
    expect(loadSpy).toHaveBeenCalledWith('any_survey_id')
  })
})
