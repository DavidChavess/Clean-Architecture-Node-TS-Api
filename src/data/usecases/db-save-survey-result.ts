import { SaveSurveyResult, SaveSurveyResultParams } from '@/domain/usecases'
import { SurveyResultModel } from '@/domain/models'
import { LoadSurveyResultRepository, SaveSurveyResultRepository } from '@/data/protocols'

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
