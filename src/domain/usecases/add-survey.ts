import { SurveyModel } from '@/domain/models'

export type AddSurveyParams = Omit<SurveyModel, 'id' | 'didAnswer'>

export interface AddSurvey {
  add: (addSurveyParams: AddSurveyParams) => Promise<void>
}
