import { SurveyModel } from '@/domain/models/survey-model'
import { LoadSurveyByIdRepository, AddSurveyRepository, LoadSurveysRepository, CheckSurveyByIdRepository, LoadAnswersBySurveyIdRepository } from '@/data/protocols/db'
import { mockSurveyModel, mockSurveyModels } from '@/tests/domain/mocks'

export const mockAddSurveyRepository = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add (survey: AddSurveyRepository.Params): Promise<void> {
      return Promise.resolve()
    }
  }
  return new AddSurveyRepositoryStub()
}

export class LoadSurveyByIdRepositorySpy implements LoadSurveyByIdRepository {
  id: string
  result: LoadSurveyByIdRepository.Result = mockSurveyModel()

  async loadById (id: string): Promise<LoadSurveyByIdRepository.Result> {
    this.id = id
    return this.result
  }
}

export class CheckSurveyByIdRepositorySpy implements CheckSurveyByIdRepository {
  id: string
  result: CheckSurveyByIdRepository.Result = true

  async checkById (id: string): Promise<CheckSurveyByIdRepository.Result> {
    this.id = id
    return this.result
  }
}

export class LoadSurveysRepositorySpy implements LoadSurveysRepository {
  accountId: string
  result: SurveyModel[] = mockSurveyModels()

  async loadAll (accountId: string): Promise<SurveyModel[]> {
    this.accountId = accountId
    return this.result
  }
}

export class LoadAnswersBySurveyIdRepositorySpy implements LoadAnswersBySurveyIdRepository {
  surveyId: string
  result: LoadAnswersBySurveyIdRepository.Result = ['answer_1', 'answer_2', 'answer_3']

  async loadAnswersBySurveyId (id: string): Promise<LoadAnswersBySurveyIdRepository.Result> {
    this.surveyId = id
    return this.result
  }
}
