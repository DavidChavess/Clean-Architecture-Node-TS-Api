import { SurveyResultModel } from '@/domain/models/survey-result-model'

export interface LoadSurveyResult {
  load: (surveyId: string) => Promise<SurveyResultModel>
}
