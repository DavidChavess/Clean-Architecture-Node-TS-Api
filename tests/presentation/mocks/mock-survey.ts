import { SurveyModel } from '@/domain/models'
import { AddSurvey, LoadSurveys, LoadAnswersBySurvey, CheckSurveyById } from '@/domain/usecases'
import { mockSurveyModels } from '@/tests/domain/mocks'

export const mockAddSurvey = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    async add (data: AddSurvey.Params): Promise<void> {
      return Promise.resolve()
    }
  }
  return new AddSurveyStub()
}

export const mockLoadAnswersBySurvey = (): LoadAnswersBySurvey => {
  class LoadAnswersBySurveyStub implements LoadAnswersBySurvey {
    async loadAnswers (id: string): Promise<LoadAnswersBySurvey.Result> {
      return ['any_answer']
    }
  }
  return new LoadAnswersBySurveyStub()
}

export const mockCheckSurveyById = (): CheckSurveyById => {
  class CheckSurveyByIdStub implements CheckSurveyById {
    async checkById (id: string): Promise<CheckSurveyById.Result> {
      return true
    }
  }
  return new CheckSurveyByIdStub()
}

export const mockLoadSurvey = (): LoadSurveys => {
  class LoadSurveyStub implements LoadSurveys {
    async load (accountId: String): Promise<SurveyModel[]> {
      return mockSurveyModels()
    }
  }
  return new LoadSurveyStub()
}
