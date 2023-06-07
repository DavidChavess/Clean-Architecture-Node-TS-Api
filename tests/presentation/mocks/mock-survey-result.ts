import { SaveSurveyResult, LoadSurveyResult } from '@/domain/usecases'
import { mockSurveyResultModel } from '@/tests/domain/mocks'

export const mockSaveSurveyResult = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save (data: SaveSurveyResult.Params): Promise<SaveSurveyResult.Result> {
      return mockSurveyResultModel()
    }
  }
  return new SaveSurveyResultStub()
}

export const mockLoadSurveyResult = (): LoadSurveyResult => {
  class LoadSurveyResultStub implements LoadSurveyResult {
    async load (params: LoadSurveyResult.Params): Promise<LoadSurveyResult.Result> {
      return mockSurveyResultModel()
    }
  }
  return new LoadSurveyResultStub()
}
