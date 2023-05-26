import { DbAddSurvey } from '@/data/usecases'
import { mockAddSurveyParams } from '@/tests/domain/mocks'
import { mockAddSurveyRepository } from '@/tests/data/mocks'
import { AddSurveyRepository } from '@/data/protocols'

describe('DbAddSurvey Usecase', () => {
  let _sut: DbAddSurvey
  let _addSurveyRepositoryStub: AddSurveyRepository

  beforeEach(() => {
    _addSurveyRepositoryStub = mockAddSurveyRepository()
    _sut = new DbAddSurvey(_addSurveyRepositoryStub)
  })

  test('Should call AddSurveyRepository with correct values', async () => {
    const spySurveyRepository = jest.spyOn(_addSurveyRepositoryStub, 'add')
    const makeFakeAddSurvey = mockAddSurveyParams()
    await _sut.add(makeFakeAddSurvey)
    expect(spySurveyRepository).toHaveBeenCalledWith(makeFakeAddSurvey)
  })

  test('Should throw if AddSurveyRepository throws', async () => {
    jest.spyOn(_addSurveyRepositoryStub, 'add').mockRejectedValueOnce(new Error('Any error'))
    const promise = _sut.add(mockAddSurveyParams())
    await expect(promise).rejects.toThrow(new Error('Any error'))
  })
})
