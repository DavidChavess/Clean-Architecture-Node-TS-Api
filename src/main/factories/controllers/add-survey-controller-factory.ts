import { Controller } from '@/presentation/protocols'
import { AddSurveyController } from '@/presentation/controllers/survey/add/add-survey-controller'
import { makeAddSurvey } from '@/main/factories/usecases'
import { makeAddSurveyValidation } from './add-survey-validation-factory'

export const makeAddSurveyController = (): Controller => {
  return new AddSurveyController(makeAddSurveyValidation(), makeAddSurvey())
}
