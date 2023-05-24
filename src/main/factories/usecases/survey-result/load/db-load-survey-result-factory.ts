import { LoadSurveyResult } from '@/domain/usecases/load-survey-result'
import { DbLoadSurveyResult } from '@/data/usecases/survey-result/load/db-load-survey-result'
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey/survey-mongo-repository'
import { SurveyResultMongoRepository } from '@/infra/db/mongodb/survey-result/survey-result-mongo-repository'

export const makeDbLoadSurveyResult = (): LoadSurveyResult => {
  const surveyResultRepository = new SurveyResultMongoRepository()
  const surveyRepository = new SurveyMongoRepository()
  return new DbLoadSurveyResult(surveyResultRepository, surveyRepository)
}
