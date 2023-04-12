import { AddSurveyParams } from '@/domain/usecases/survey/add-survey'
import { SurveyModel } from '../models/survey-model'

export const mockAddSurveyParams = (): AddSurveyParams => ({
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }],
  date: new Date()
})

export const mockSurveyModel = (): SurveyModel => ({
  id: '1',
  question: 'question 1',
  date: new Date(),
  answers: [{ answer: 'any_answer' }]
})

export const mockSurveyModels = (): SurveyModel[] => ([
  {
    id: '1',
    question: 'question 1',
    date: new Date(),
    answers: [{ answer: 'any_answer' }]
  },
  {
    id: '2',
    question: 'question 2',
    date: new Date(),
    answers: [{ answer: 'any_answer' }]
  }
])
