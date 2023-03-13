import { LoadSurveys } from '@/domain/usecases/load-surveys'
import { DbLoadSurveys } from '@/data/usecases/survey/load/db-load-surveys'
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey/survey-mongo-repository'

export const makeLoadSurveys = (): LoadSurveys => {
  const addSurveyRepository = new SurveyMongoRepository()
  return new DbLoadSurveys(addSurveyRepository)
}
