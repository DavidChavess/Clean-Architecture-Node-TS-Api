import { SaveSurveyResultParams } from '@/domain/usecases/save-survey-result'

export class SurveyResultListBuilder {
  private index: number = -1
  private readonly surveys: SaveSurveyResultParams[] = []

  aSeller (): SurveyResultListBuilder {
    this.index++
    this.surveys.push({
      surveyId: '',
      accountId: '',
      answer: '',
      date: new Date()
    })
    return this
  }

  withAccountId (accountId: string): SurveyResultListBuilder {
    this.surveys[this.index].accountId = accountId
    return this
  }

  withSurveyId (surveyId: string): SurveyResultListBuilder {
    this.surveys[this.index].surveyId = surveyId
    return this
  }

  withAnswer (answer: string): SurveyResultListBuilder {
    this.surveys[this.index].answer = answer
    return this
  }

  build (): SaveSurveyResultParams[] {
    return this.surveys
  }
}
