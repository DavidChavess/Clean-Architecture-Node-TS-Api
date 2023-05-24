import { SaveSurveyResultController } from '@/presentation/controllers/survey-result/save/save-survey-result-controller'
import { makeDbSaveSurveyResult } from '@/main/factories/usecases/db-save-survey-result-factory'
import { makeDbLoadSurveyById } from '@/main/factories/usecases/db-load-survey-by-id-factory'

export const makeSaveSurveyResultController = (): SaveSurveyResultController => {
  return new SaveSurveyResultController(makeDbLoadSurveyById(), makeDbSaveSurveyResult())
}
