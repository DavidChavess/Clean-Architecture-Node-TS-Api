import { DbLoadSurveyById } from './db-load-survey-by-id'
import { LoadSurveyByIdRepository } from '@/data/protocols'
import MockDate from 'mockdate'
import { mockSurveyModel } from '@/domain/test'
import { mockLoadSurveyByIdRepository } from '@/data/test'

describe('DbLoadSurveyById Usecase', () => {
  let _sut: DbLoadSurveyById
  let _loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository

  beforeAll(async () => {
    MockDate.set(new Date())
  })

  afterAll(async () => {
    MockDate.reset()
  })

  beforeEach(() => {
    _loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository()
    _sut = new DbLoadSurveyById(_loadSurveyByIdRepositoryStub)
  })

  test('Should call LoadSurveyByIdRepository with correct id', async () => {
    const spyLoadSurveyByIdRepo = jest.spyOn(_loadSurveyByIdRepositoryStub, 'loadById')
    await _sut.loadById('any_id')
    expect(spyLoadSurveyByIdRepo).toHaveBeenCalledWith('any_id')
  })

  test('Should return survey on success', async () => {
    const survey = await _sut.loadById('any_id')
    expect(survey).toEqual(mockSurveyModel())
  })

  test('Should throws if LoadSurveyByIdRepository throw', async () => {
    jest.spyOn(_loadSurveyByIdRepositoryStub, 'loadById').mockRejectedValueOnce(new Error())
    const promise = _sut.loadById('any_id')
    await expect(promise).rejects.toThrow(new Error())
  })
})
