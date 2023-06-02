export class SurveyResultListBuilder {
  private index: number = -1
  private readonly surveys: any[] = []

  aSeller (): SurveyResultListBuilder {
    this.index++
    this.surveys.push({
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

  build (): any[] {
    return this.surveys
  }
}
