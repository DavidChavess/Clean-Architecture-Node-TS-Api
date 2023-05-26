import { SaveSurveyResult } from '@/domain/usecases'
import { DbSaveSurveyResult } from '@/data/usecases'
import { SurveyResultMongoRepository } from '@/infra/db'

export const makeDbSaveSurveyResult = (): SaveSurveyResult => {
  const surveyResultRepository = new SurveyResultMongoRepository()
  return new DbSaveSurveyResult(surveyResultRepository, surveyResultRepository)
}
