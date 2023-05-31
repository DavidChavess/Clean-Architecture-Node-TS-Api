import { SurveyModel } from '@/domain/models/survey-model'
import { AddSurvey } from '@/domain/usecases/add-survey'

export const mockAddSurveyParams = (): AddSurvey.Params => ({
  question: 'any_question',
  answers: [
    {
      image: 'any_image',
      answer: 'any_answer'
    },
    {
      image: 'any_image_2',
      answer: 'any_answer_2'
    },
    {
      image: 'any_image_3',
      answer: 'any_answer_3'
    }
  ],
  date: new Date()
})

export const mockSurveyModel = (): SurveyModel => ({
  id: 'any_survey_id',
  question: 'any_question',
  date: new Date(),
  answers: [{ answer: 'any_answer', image: 'any_image' }]
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
