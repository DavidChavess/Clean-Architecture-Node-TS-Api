import { SurveyMongoRepository } from '@/infra/db/mongodb/survey/survey-mongo-repository'
import { LoadSurveyById } from '@/domain/usecases/load-survey-by-id'
import { DbLoadSurveyById } from '@/data/usecases/db-load-survey-by-id'

export const makeDbLoadSurveyById = (): LoadSurveyById => {
  const surveyRepository = new SurveyMongoRepository()
  return new DbLoadSurveyById(surveyRepository)
}
