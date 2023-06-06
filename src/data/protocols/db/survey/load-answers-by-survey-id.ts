export interface LoadAnswersBySurveyIdRepository {
  loadAnswersBySurveyId: (id: string) => Promise<LoadAnswersBySurveyIdRepository.Result>
}

export namespace LoadAnswersBySurveyIdRepository {
  export type Result = string[]
}
