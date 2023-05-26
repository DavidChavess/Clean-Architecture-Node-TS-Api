import { DbLoadSurveys } from '@/data/usecases'
import { LoadSurveysRepository } from '@/data/protocols'
import MockDate from 'mockdate'
import { mockSurveyModels } from '@/tests/domain/mocks'
import { mockLoadSurveysRepository } from '@/tests/data/mocks'

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
