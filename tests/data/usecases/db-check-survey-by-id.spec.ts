import { DbCheckSurveyById } from '@/data/usecases'
import { CheckSurveyByIdRepositorySpy } from '@/tests/data/mocks'

describe('DbCheckSurveyById Usecase', () => {
  let _sut: DbCheckSurveyById
  let _checkSurveyByIdRepositorySpy: CheckSurveyByIdRepositorySpy

  beforeEach(() => {
    _checkSurveyByIdRepositorySpy = new CheckSurveyByIdRepositorySpy()
    _sut = new DbCheckSurveyById(_checkSurveyByIdRepositorySpy)
  })

  test('Should call CheckSurveyByIdRepository with correct id', async () => {
    await _sut.checkById('any_id')
    expect(_checkSurveyByIdRepositorySpy.id).toBe('any_id')
  })

  test('Should return true if exists survey by id', async () => {
    const exists = await _sut.checkById('any_id')
    expect(exists).toBe(true)
  })

  test('Should throws if CheckSurveyByIdRepository throw', async () => {
    jest.spyOn(_checkSurveyByIdRepositorySpy, 'checkById').mockRejectedValueOnce(new Error())
    const promise = _sut.checkById('any_id')
    await expect(promise).rejects.toThrow(new Error())
  })
})
