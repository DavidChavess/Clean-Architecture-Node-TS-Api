import { SaveSurveyResult } from '@/domain/usecases/save-survey-result'
import { DbSaveSurveyResult } from '@/data/usecases/db-save-survey-result'
import { SurveyResultMongoRepository } from '@/infra/db/mongodb/survey-result/survey-result-mongo-repository'

export const makeDbSaveSurveyResult = (): SaveSurveyResult => {
  const surveyResultRepository = new SurveyResultMongoRepository()
  return new DbSaveSurveyResult(surveyResultRepository, surveyResultRepository)
}
