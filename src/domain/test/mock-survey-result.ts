import { SurveyResultModel } from '@/domain/models/survey-result-model'
import { SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result'
import { LoadSurveyResultParams } from '@/domain/usecases/survey-result/load-survey-result'

export const mockSaveSurveyResultParams = (): SaveSurveyResultParams => ({
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
