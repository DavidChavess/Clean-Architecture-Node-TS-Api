import { SurveyResultModel } from '@/domain/models/survey-result-model'
import { SaveSurveyResult, SaveSurveyResultParams } from '@/domain/usecases/save-survey-result'
import { LoadSurveyResult, LoadSurveyResultParams } from '@/domain/usecases/load-survey-result'
import { mockSurveyResultModel } from '@/domain/test'

export const mockSaveSurveyResult = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return mockSurveyResultModel()
    }
  }
  return new SaveSurveyResultStub()
}

export const mockLoadSurveyResult = (): LoadSurveyResult => {
  class LoadSurveyResultStub implements LoadSurveyResult {
    async load (params: LoadSurveyResultParams): Promise<SurveyResultModel> {
      return mockSurveyResultModel()
    }
  }
  return new LoadSurveyResultStub()
}
