import { SurveyResultModel } from '@/domain/models/survey-result-model'
import { LoadSurveyResultParams } from '@/domain/usecases/survey-result/load-survey-result'

export interface LoadSurveyResultRepository {
  loadBySurveyId: (params: LoadSurveyResultParams) => Promise<SurveyResultModel | null>
}
