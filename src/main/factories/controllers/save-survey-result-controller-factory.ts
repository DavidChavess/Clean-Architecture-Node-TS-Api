import { SaveSurveyResultController } from '@/presentation/controllers'
import { makeDbSaveSurveyResult, makeDbLoadAnswersBySurvey } from '@/main/factories/usecases'

export const makeSaveSurveyResultController = (): SaveSurveyResultController => {
  return new SaveSurveyResultController(makeDbLoadAnswersBySurvey(), makeDbSaveSurveyResult())
}
