import { SaveSurveyResultParams } from '@/domain/usecases/save-survey-result'

export interface SaveSurveyResultRepository {
  save: (saveSurveyResultParams: SaveSurveyResultParams) => Promise<void>
}
