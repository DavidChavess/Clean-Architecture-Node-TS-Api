import { SurveyModel } from '@/domain/models/survey-model'
import { AddSurvey } from '@/domain/usecases/add-survey'
import { LoadSurveyById } from '@/domain/usecases/load-survey-by-id'
import { LoadSurveys } from '@/domain/usecases/load-surveys'
import { mockSurveyModel, mockSurveyModels } from '@/tests/domain/mocks'

export const mockAddSurvey = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    async add (data: AddSurvey.Params): Promise<void> {
      return Promise.resolve()
    }
  }
  return new AddSurveyStub()
}

export const mockLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById (id: string): Promise<SurveyModel | null> {
      return mockSurveyModel()
    }
  }
  return new LoadSurveyByIdStub()
}

export const mockLoadSurvey = (): LoadSurveys => {
  class LoadSurveyStub implements LoadSurveys {
    async load (accountId: String): Promise<SurveyModel[]> {
      return mockSurveyModels()
    }
  }
  return new LoadSurveyStub()
}
