import { LoadSurveyResultRepository, SaveSurveyResult, SaveSurveyResultParams, SaveSurveyResultRepository, SurveyResultModel } from './db-save-survey-result.protocols'

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor (
    private readonly saveSurveyResultRepository: SaveSurveyResultRepository,
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository
  ) {}

  async save (data: SaveSurveyResultParams): Promise<SurveyResultModel | null> {
    await this.saveSurveyResultRepository.save(data)
    const { accountId, surveyId } = data
    return this.loadSurveyResultRepository.loadBySurveyId({ accountId, surveyId })
  }
}
