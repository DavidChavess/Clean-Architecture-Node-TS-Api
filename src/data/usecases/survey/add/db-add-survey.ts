import { AddSurveyRepository, AddSurvey, AddSurveyModel } from './db-add-survey-protocols'

export class DbAddSurvey implements AddSurvey {
  constructor (private readonly addSurveyRepository: AddSurveyRepository) {}
  async add (survey: AddSurveyModel): Promise<void> {
    return this.addSurveyRepository.add(survey)
  }
}
