export interface AddSurveyRepository {
  add: (survey: AddSurveyRepository.Params) => Promise<void>
}

export namespace AddSurveyRepository {
  export type Params = {
    question: string
    answers: SurveyAnswerModel[]
    date: Date
  }

  type SurveyAnswerModel = {
    image?: string
    answer: string
  }
}
