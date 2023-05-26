import { LoadSurveys } from '@/domain/usecases'
import { DbLoadSurveys } from '@/data/usecases'
import { SurveyMongoRepository } from '@/infra/db'

export const makeLoadSurveys = (): LoadSurveys => {
  const addSurveyRepository = new SurveyMongoRepository()
  return new DbLoadSurveys(addSurveyRepository)
}
