
import { mockSurveyResultModel } from '@/tests/domain/mocks'
import { SaveSurveyResultRepository, LoadSurveyResultRepository } from '@/data/protocols/db'

export class SaveSurveyResultRepositorySpy implements SaveSurveyResultRepository {
  params: SaveSurveyResultRepository.Params

  async save (data: SaveSurveyResultRepository.Params): Promise<void> {
    this.params = data
  }
}

export class LoadSurveyResultRepositorySpy implements LoadSurveyResultRepository {
  params: LoadSurveyResultRepository.Params
  result: LoadSurveyResultRepository.Result | null = mockSurveyResultModel()

  async loadBySurveyId (params: LoadSurveyResultRepository.Params): Promise<LoadSurveyResultRepository.Result | null> {
    this.params = params
    return this.result
  }
}
