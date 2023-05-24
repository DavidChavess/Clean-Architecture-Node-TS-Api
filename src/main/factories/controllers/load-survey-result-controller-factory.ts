
import { LoadSurveyResultController } from '@/presentation/controllers/survey-result/load/load-survey-result-controller'
import { makeDbLoadSurveyById, makeDbLoadSurveyResult } from '@/main/factories/usecases'

export const makeLoadSurveyResultController = (): LoadSurveyResultController => {
  return new LoadSurveyResultController(makeDbLoadSurveyById(), makeDbLoadSurveyResult())
}
