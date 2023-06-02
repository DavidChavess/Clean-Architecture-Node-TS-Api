import { SurveyResultModel } from '@/domain/models'

export interface LoadSurveyResultRepository {
  loadBySurveyId: (params: LoadSurveyResultRepository.Params) => Promise<LoadSurveyResultRepository.Result | null>
}

export namespace LoadSurveyResultRepository {
  export type Params = {
    surveyId: string
    accountId: string
  }
  export type Result = SurveyResultModel
}
