import { AddSurvey } from '@/domain/usecases'
import { DbAddSurvey } from '@/data/usecases'
import { SurveyMongoRepository } from '@/infra/db'

export const makeAddSurvey = (): AddSurvey => {
  const addSurveyRepository = new SurveyMongoRepository()
  return new DbAddSurvey(addSurveyRepository)
}
