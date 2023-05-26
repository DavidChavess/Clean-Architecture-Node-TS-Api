import { AddSurveyController } from '@/presentation/controllers'
import { Controller } from '@/presentation/protocols'
import { makeAddSurvey } from '@/main/factories/usecases'
import { makeAddSurveyValidation } from '@/main/factories/controllers'

export const makeAddSurveyController = (): Controller => {
  return new AddSurveyController(makeAddSurveyValidation(), makeAddSurvey())
}
