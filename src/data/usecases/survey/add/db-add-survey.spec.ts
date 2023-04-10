import { DbAddSurvey } from './db-add-survey'
import { AddSurveyRepository, AddSurveyParams } from './db-add-survey-protocols'

class AddSurveyRepositoryStub implements AddSurveyRepository {
  async add (survey: AddSurveyParams): Promise<void> {
    return Promise.resolve()
  }
}

const makeFakeAddSurveyModel = (): AddSurveyParams => ({
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }],
  date: new Date()
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

  test('Should throw if AddSurveyRepository throws', async () => {
    jest.spyOn(_addSurveyRepositoryStub, 'add').mockRejectedValueOnce(new Error('Any error'))
    const promise = _sut.add(makeFakeAddSurveyModel())
    await expect(promise).rejects.toThrow(new Error('Any error'))
  })
})
