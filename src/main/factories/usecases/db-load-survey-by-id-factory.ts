import { LoadSurveyById } from '@/domain/usecases'
import { DbLoadSurveyById } from '@/data/usecases'
import { SurveyMongoRepository } from '@/infra/db'

export const makeDbLoadSurveyById = (): LoadSurveyById => {
  const surveyRepository = new SurveyMongoRepository()
  return new DbLoadSurveyById(surveyRepository)
}
