
import { LoadSurveyResultController } from '@/presentation/controllers'
import { makeDbCheckSurveyById, makeDbLoadSurveyResult } from '@/main/factories/usecases'

export const makeLoadSurveyResultController = (): LoadSurveyResultController => {
  return new LoadSurveyResultController(makeDbCheckSurveyById(), makeDbLoadSurveyResult())
}
