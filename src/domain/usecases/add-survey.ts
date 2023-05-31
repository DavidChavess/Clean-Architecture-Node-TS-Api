export interface AddSurvey {
  add: (params: AddSurvey.Params) => Promise<void>
}

export namespace AddSurvey {
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
