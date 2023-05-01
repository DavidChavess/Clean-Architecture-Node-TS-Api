
import { LoadSurveyResultController } from '@/presentation/controllers/survey-result/load/load-survey-result-controller'
import { makeDbLoadSurveyResult } from '@/main/factories/usecases/survey-result/load/db-load-survey-result-factory'
import { makeDbLoadSurveyById } from '@/main/factories/usecases/survey/load-by-id/db-load-survey-by-id-factory'

export const makeLoadSurveyResultController = (): LoadSurveyResultController => {
  return new LoadSurveyResultController(makeDbLoadSurveyById(), makeDbLoadSurveyResult())
}
