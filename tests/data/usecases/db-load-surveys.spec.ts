import { DbLoadSurveys } from '@/data/usecases'
import { mockSurveyModels } from '@/tests/domain/mocks'
import { LoadSurveysRepositorySpy } from '@/tests/data/mocks'
import MockDate from 'mockdate'

describe('DbLoadSurveys Usecase', () => {
  let _sut: DbLoadSurveys
  let _loadSurveysRepositorySpy: LoadSurveysRepositorySpy

  beforeAll(async () => {
    MockDate.set(new Date())
  })

  afterAll(async () => {
    MockDate.reset()
  })

  beforeEach(() => {
    _loadSurveysRepositorySpy = new LoadSurveysRepositorySpy()
    _sut = new DbLoadSurveys(_loadSurveysRepositorySpy)
  })

  test('Should call LoadSurveysRepository', async () => {
    await _sut.load('any_account_id')
    expect(_loadSurveysRepositorySpy.accountId).toBe('any_account_id')
  })

  test('Should return a list of Surveys on success', async () => {
    const surveys = await _sut.load('any_account_id')
    expect(surveys).toEqual(mockSurveyModels())
  })

  test('Should throws if LoadSurveysRepository throw', async () => {
    jest.spyOn(_loadSurveysRepositorySpy, 'loadAll').mockRejectedValueOnce(new Error())
    const promise = _sut.load('any_account_id')
    await expect(promise).rejects.toThrow(new Error())
  })
})
