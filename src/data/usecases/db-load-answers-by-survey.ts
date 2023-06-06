
import { LoadAnswersBySurvey } from '@/domain/usecases'
import { LoadAnswersBySurveyIdRepository } from '@/data/protocols'

export class DbLoadAnswersBySurvey implements LoadAnswersBySurvey {
  constructor (private readonly loadAnswersBySurveyIdRepository: LoadAnswersBySurveyIdRepository) {}

  async loadAnswers (id: string): Promise<LoadAnswersBySurvey.Result> {
    return this.loadAnswersBySurveyIdRepository.loadAnswersBySurveyId(id)
  }
}
