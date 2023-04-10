import { AddSurveyRepository, AddSurvey, AddSurveyParams } from './db-add-survey-protocols'

export class DbAddSurvey implements AddSurvey {
  constructor (private readonly addSurveyRepository: AddSurveyRepository) {}
  async add (survey: AddSurveyParams): Promise<void> {
    return this.addSurveyRepository.add(survey)
  }
}
