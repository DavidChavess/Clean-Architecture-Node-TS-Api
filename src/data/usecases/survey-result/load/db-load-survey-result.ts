import { LoadSurveyByIdRepository, LoadSurveyResult, LoadSurveyResultRepository, SurveyResultModel, LoadSurveyResultParams } from './db-load-survey-result-protocols'

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor (
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository,
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository
  ) {}

  async load (params: LoadSurveyResultParams): Promise<SurveyResultModel> {
    const surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(params)
    if (surveyResult) {
      return surveyResult
    }
    const { surveyId } = params
    const survey = await this.loadSurveyByIdRepository.loadById(surveyId)
    return {
      surveyId,
      answers: survey.answers.map(answer => Object.assign({}, answer, {
        count: 0, percent: 0, isCurrentAccountAnswer: false
      })),
      question: survey.question,
      date: survey.date
    }
  }
}
