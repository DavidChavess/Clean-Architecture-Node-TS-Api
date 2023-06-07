import { DbAddSurvey } from '@/data/usecases'
import { mockAddSurveyParams } from '@/tests/domain/mocks'
import { AddSurveyRepositorySpy } from '@/tests/data/mocks'

describe('DbAddSurvey Usecase', () => {
  let _sut: DbAddSurvey
  let _addSurveyRepositorySpy: AddSurveyRepositorySpy

  beforeEach(() => {
    _addSurveyRepositorySpy = new AddSurveyRepositorySpy()
    _sut = new DbAddSurvey(_addSurveyRepositorySpy)
  })

  test('Should call AddSurveyRepository with correct values', async () => {
    const makeFakeAddSurvey = mockAddSurveyParams()
    await _sut.add(makeFakeAddSurvey)
    expect(_addSurveyRepositorySpy.params).toEqual(makeFakeAddSurvey)
  })

  test('Should throw if AddSurveyRepository throws', async () => {
    jest.spyOn(_addSurveyRepositorySpy, 'add').mockRejectedValueOnce(new Error('Any error'))
    const promise = _sut.add(mockAddSurveyParams())
    await expect(promise).rejects.toThrow(new Error('Any error'))
  })
})
