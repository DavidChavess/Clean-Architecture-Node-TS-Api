import { SaveSurveyResultController } from '@/presentation/controllers/survey-result/save/save-survey-result-controller'
import { makeDbSaveSurveyResult } from '@/main/factories/usecases/survey-result/save/db-save-survey-result-factory'
import { makeDbLoadSurveyById } from '@/main/factories/usecases/survey/load-by-id/db-load-survey-by-id-factory'

export const makeSaveSurveyResultController = (): SaveSurveyResultController => {
  return new SaveSurveyResultController(makeDbLoadSurveyById(), makeDbSaveSurveyResult())
}
