import { LoadSurveyByIdRepository, LoadSurveyResult, LoadSurveyResultRepository, SurveyResultModel } from './db-load-survey-result-protocols'

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor (
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository,
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository
  ) {}

  async load (surveyId: string): Promise<SurveyResultModel> {
    const surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(surveyId)
    if (surveyResult) {
      return surveyResult
    }
    const survey = await this.loadSurveyByIdRepository.loadById(surveyId)
    return {
      surveyId,
      answers: survey.answers.map(answer => ({ answer: answer.answer, image: answer.image, count: 0, percent: 0 })),
      question: survey.question,
      date: survey.date
    }
  }
}
