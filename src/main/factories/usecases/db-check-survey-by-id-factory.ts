import { CheckSurveyById } from '@/domain/usecases'
import { DbCheckSurveyById } from '@/data/usecases'
import { SurveyMongoRepository } from '@/infra/db'

export const makeDbCheckSurveyById = (): CheckSurveyById => {
  const surveyRepository = new SurveyMongoRepository()
  return new DbCheckSurveyById(surveyRepository)
}
