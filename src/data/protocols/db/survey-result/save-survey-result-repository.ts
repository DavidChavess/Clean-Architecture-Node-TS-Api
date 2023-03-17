import { SurveyResultModel } from '@/domain/models/survey-result-model'
import { SaveSurveyResultModel } from '@/domain/usecases/survey-result/save-survey-result'

export interface SaveSurveyResultRepository {
  save: (survey: SaveSurveyResultModel) => Promise<SurveyResultModel>
}
