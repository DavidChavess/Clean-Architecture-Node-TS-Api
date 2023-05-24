import { mockAddSurveyParams } from '@/domain/test'
import { DbAddSurvey } from './db-add-survey'
import { AddSurveyRepository } from '@/data/protocols'
import { mockAddSurveyRepository } from '@/data/test'

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
