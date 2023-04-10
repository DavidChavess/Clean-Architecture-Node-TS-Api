import { SurveyResultModel } from '@/domain/models/survey-result-model'
import { SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result'

export interface SaveSurveyResultRepository {
  save: (saveSurveyResultParams: SaveSurveyResultParams) => Promise<SurveyResultModel>
}
