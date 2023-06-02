import { SurveyModel } from '@/domain/models/survey-model'
import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository'
import { AddSurveyRepository } from '@/data/protocols/db/survey/add-survey-repository'
import { LoadSurveysRepository } from '@/data/protocols/db/survey/load-surveys-repository'
import { mockSurveyModel, mockSurveyModels } from '@/tests/domain/mocks'

export const mockAddSurveyRepository = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add (survey: AddSurveyRepository.Params): Promise<void> {
      return Promise.resolve()
    }
  }
  return new AddSurveyRepositoryStub()
}

export const mockLoadSurveyByIdRepository = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById (id: string): Promise<SurveyModel> {
      return mockSurveyModel()
    }
  }
  return new LoadSurveyByIdRepositoryStub()
}

export class LoadSurveysRepositorySpy implements LoadSurveysRepository {
  accountId: string
  result: SurveyModel[] = mockSurveyModels()

  async loadAll (accountId: string): Promise<SurveyModel[]> {
    this.accountId = accountId
    return this.result
  }
}
