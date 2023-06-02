import { DbLoadSurveyById } from '@/data/usecases'
import { LoadSurveyByIdRepositorySpy } from '@/tests/data/mocks'
import MockDate from 'mockdate'

describe('DbLoadSurveyById Usecase', () => {
  let _sut: DbLoadSurveyById
  let _loadSurveyByIdRepositorySpy: LoadSurveyByIdRepositorySpy

  beforeAll(async () => {
    MockDate.set(new Date())
  })

  afterAll(async () => {
    MockDate.reset()
  })

  beforeEach(() => {
    _loadSurveyByIdRepositorySpy = new LoadSurveyByIdRepositorySpy()
    _sut = new DbLoadSurveyById(_loadSurveyByIdRepositorySpy)
  })

  test('Should call LoadSurveyByIdRepository with correct id', async () => {
    await _sut.loadById('any_id')
    expect(_loadSurveyByIdRepositorySpy.id).toBe('any_id')
  })

  test('Should return survey on success', async () => {
    const survey = await _sut.loadById('any_id')
    expect(survey).toEqual(_loadSurveyByIdRepositorySpy.result)
  })

  test('Should throws if LoadSurveyByIdRepository throw', async () => {
    jest.spyOn(_loadSurveyByIdRepositorySpy, 'loadById').mockRejectedValueOnce(new Error())
    const promise = _sut.loadById('any_id')
    await expect(promise).rejects.toThrow(new Error())
  })
})
