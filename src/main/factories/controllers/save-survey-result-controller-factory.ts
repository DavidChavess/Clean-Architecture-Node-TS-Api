import { SaveSurveyResultController } from '@/presentation/controllers'
import { makeDbSaveSurveyResult, makeDbLoadSurveyById } from '@/main/factories/usecases'

export const makeSaveSurveyResultController = (): SaveSurveyResultController => {
  return new SaveSurveyResultController(makeDbLoadSurveyById(), makeDbSaveSurveyResult())
}
