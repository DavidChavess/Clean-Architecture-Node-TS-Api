import { Controller } from '../../../../../presentation/protocols'
import { LoadSurveysController } from '../../../../../presentation/controllers/survey/load/load-surveys-controller'
import { makeLoadSurveys } from '../../../usecases/survey/load/load-surveys-factory'

export const makeLoadSurveysController = (): Controller => {
  return new LoadSurveysController(makeLoadSurveys())
}
