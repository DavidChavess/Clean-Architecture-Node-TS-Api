import { Controller } from '../../../../presentation/protocols'
import { AddSurveyController } from '../../../../presentation/controllers/survey/add/add-survey-controller'
import { makeAddSurvey } from '../../usecases/add-survey/add-survey-factory'
import { makeAddSurveyValidation } from './add-survey-validation-factory'

export const makeAddSurveyController = (): Controller => {
  return new AddSurveyController(makeAddSurveyValidation(), makeAddSurvey())
}
