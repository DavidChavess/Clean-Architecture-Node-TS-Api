import { DbAddSurvey } from './db-add-survey'
import { AddSurveyRepository, AddSurveyModel } from './db-add-survey-protocols'

class AddSurveyRepositoryStub implements AddSurveyRepository {
  async add (survey: AddSurveyModel): Promise<void> {
    return Promise.resolve()
  }
}

const makeFakeAddSurveyModel = (): AddSurveyModel => ({
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }]
})

describe('DbAddSurvey Usecase', () => {
  let _sut: DbAddSurvey
  let _addSurveyRepositoryStub: AddSurveyRepositoryStub

  beforeEach(() => {
    _addSurveyRepositoryStub = new AddSurveyRepositoryStub()
    _sut = new DbAddSurvey(_addSurveyRepositoryStub)
  })

  test('Should call AddSurveyRepository with correct values', async () => {
    const spySurveyRepository = jest.spyOn(_addSurveyRepositoryStub, 'add')
    const makeFakeAddSurvey = makeFakeAddSurveyModel()
    await _sut.add(makeFakeAddSurvey)
    expect(spySurveyRepository).toHaveBeenCalledWith(makeFakeAddSurvey)
  })
})
