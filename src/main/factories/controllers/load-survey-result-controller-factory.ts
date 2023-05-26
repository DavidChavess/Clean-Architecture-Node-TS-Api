
import { LoadSurveyResultController } from '@/presentation/controllers'
import { makeDbLoadSurveyById, makeDbLoadSurveyResult } from '@/main/factories/usecases'

export const makeLoadSurveyResultController = (): LoadSurveyResultController => {
  return new LoadSurveyResultController(makeDbLoadSurveyById(), makeDbLoadSurveyResult())
}
