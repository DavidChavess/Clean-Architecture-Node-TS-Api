import { DbLoadAnswersBySurvey } from '@/data/usecases'
import { LoadAnswersBySurveyIdRepositorySpy } from '@/tests/data/mocks'

describe('DbLoadAnswersBySurvey Usecase', () => {
  let _sut: DbLoadAnswersBySurvey
  let _loadAnswersBySurveyIdRepositorySpy: LoadAnswersBySurveyIdRepositorySpy

  beforeEach(() => {
    _loadAnswersBySurveyIdRepositorySpy = new LoadAnswersBySurveyIdRepositorySpy()
    _sut = new DbLoadAnswersBySurvey(_loadAnswersBySurveyIdRepositorySpy)
  })

  test('Should call LoadAnswersBySurveyIdRepository with correct id', async () => {
    await _sut.loadAnswers('any_survey_id')
    expect(_loadAnswersBySurveyIdRepositorySpy.surveyId).toBe('any_survey_id')
  })

  test('Should return survey on success', async () => {
    const answers = await _sut.loadAnswers('any_survey_id')
    expect(answers).toEqual(_loadAnswersBySurveyIdRepositorySpy.result)
  })

  test('Should throws if LoadAnswersBySurveyIdRepository throw', async () => {
    jest.spyOn(_loadAnswersBySurveyIdRepositorySpy, 'loadAnswersBySurveyId').mockRejectedValueOnce(new Error())
    const promise = _sut.loadAnswers('any_survey_id')
    await expect(promise).rejects.toThrow(new Error())
  })
})
