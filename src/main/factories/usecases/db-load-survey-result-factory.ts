import { LoadSurveyResult } from '@/domain/usecases'
import { DbLoadSurveyResult } from '@/data/usecases'
import { SurveyMongoRepository, SurveyResultMongoRepository } from '@/infra/db'

export const makeDbLoadSurveyResult = (): LoadSurveyResult => {
  const surveyResultRepository = new SurveyResultMongoRepository()
  const surveyRepository = new SurveyMongoRepository()
  return new DbLoadSurveyResult(surveyResultRepository, surveyRepository)
}
