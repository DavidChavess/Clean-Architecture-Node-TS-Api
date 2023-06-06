import { LoadAnswersBySurvey } from '@/domain/usecases'
import { DbLoadAnswersBySurvey } from '@/data/usecases'
import { SurveyMongoRepository } from '@/infra/db'

export const makeDbLoadAnswersBySurvey = (): LoadAnswersBySurvey => {
  const surveyRepository = new SurveyMongoRepository()
  return new DbLoadAnswersBySurvey(surveyRepository)
}
