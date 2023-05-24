import { DbLoadSurveys } from './db-load-surveys'
import { LoadSurveysRepository } from '@/data/protocols'
import MockDate from 'mockdate'
import { mockSurveyModels } from '@/domain/test'
import { mockLoadSurveysRepository } from '@/data/test'

describe('DbLoadSurveys Usecase', () => {
  let _sut: DbLoadSurveys
  let _loadSurveysRepositoryStub: LoadSurveysRepository

  beforeAll(async () => {
    MockDate.set(new Date())
  })

  afterAll(async () => {
    MockDate.reset()
  })

  beforeEach(() => {
    _loadSurveysRepositoryStub = mockLoadSurveysRepository()
    _sut = new DbLoadSurveys(_loadSurveysRepositoryStub)
  })

  test('Should call LoadSurveysRepository', async () => {
    const spyLoadSurveysRepository = jest.spyOn(_loadSurveysRepositoryStub, 'loadAll')
    await _sut.load('any_account_id')
    expect(spyLoadSurveysRepository).toHaveBeenCalledWith('any_account_id')
  })

  test('Should return a list of Surveys on success', async () => {
    const surveys = await _sut.load('any_account_id')
    expect(surveys).toEqual(mockSurveyModels())
  })

  test('Should throws if LoadSurveysRepository throw', async () => {
    jest.spyOn(_loadSurveysRepositoryStub, 'loadAll').mockRejectedValueOnce(new Error())
    const promise = _sut.load('any_account_id')
    await expect(promise).rejects.toThrow(new Error())
  })
})
