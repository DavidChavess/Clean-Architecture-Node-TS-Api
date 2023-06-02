import { SurveyResultModel } from '@/domain/models/survey-result-model'
import { SaveSurveyResult, LoadSurveyResultParams } from '@/domain/usecases'

export const mockSaveSurveyResultParams = (): SaveSurveyResult.Params => ({
  accountId: 'any_account_id',
  surveyId: 'any_survey_id',
  answer: 'any_answer',
  date: new Date()
})

export const mockSurveyResultModel = (): SurveyResultModel => ({
  surveyId: 'any_survey_id',
  question: 'any_question',
  answers: [{
    answer: 'any_answer',
    image: 'any_image',
    count: 0,
    percent: 0,
    isCurrentAccountAnswer: false
  }],
  date: new Date()
})

export const mockLoadSurveyResultParams = (): LoadSurveyResultParams => ({
  surveyId: 'any_survey_id',
  accountId: 'any_account_id'
})
