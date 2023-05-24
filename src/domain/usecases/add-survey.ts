import { SurveyModel } from '@/domain/models/survey-model'

export type AddSurveyParams = Omit<SurveyModel, 'id' | 'didAnswer'>

export interface AddSurvey {
  add: (addSurveyParams: AddSurveyParams) => Promise<void>
}
