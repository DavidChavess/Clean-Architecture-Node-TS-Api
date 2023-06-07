import { LoadSurveyByIdRepository, AddSurveyRepository, LoadSurveysRepository, CheckSurveyByIdRepository, LoadAnswersBySurveyIdRepository } from '@/data/protocols/db'
import { mockSurveyModel, mockSurveyModels } from '@/tests/domain/mocks'

export class AddSurveyRepositorySpy implements AddSurveyRepository {
  params: AddSurveyRepository.Params

  async add (survey: AddSurveyRepository.Params): Promise<void> {
    this.params = survey
    return Promise.resolve()
  }
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
  result: LoadSurveysRepository.Result = mockSurveyModels()

  async loadAll (accountId: string): Promise<LoadSurveysRepository.Result> {
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
