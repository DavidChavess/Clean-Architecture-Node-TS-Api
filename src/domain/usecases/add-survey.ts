import { SurveyModel } from '@/domain/models/survey-model'

export type AddSurveyModel = Omit<SurveyModel, 'id'>

export interface AddSurvey {
  add: (account: AddSurveyModel) => Promise<void>
}
