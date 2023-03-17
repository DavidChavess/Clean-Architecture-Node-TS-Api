import { Collection } from 'mongodb'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { SurveyResultMongoRepository } from './survey-result-mongo-repository'
import MockDate from 'mockdate'

describe('Survey Result Mongo Repository', () => {
  let surveyCollection: Collection
  let surveyResultsCollection: Collection
  let accountCollection: Collection

  beforeAll(async () => {
    MockDate.set(new Date())
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    MockDate.reset()
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    surveyResultsCollection = await MongoHelper.getCollection('surveyResults')
    await surveyResultsCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  const makeAccount = async (): Promise<any> => {
    const account = {
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    }
    await accountCollection.insertOne(account)
    return account
  }

  const makeSurvey = async (): Promise<any> => {
    const survey = {
      question: 'any_question',
      answers: [{
        image: 'any_image',
        answer: 'any_answer'
      }],
      date: new Date()
    }
    await surveyCollection.insertOne(survey)
    return survey
  }

  const makeSurveyResultWithAccountIdAndSurveyId = async (accountId, surveyId): Promise<any> => {
    const surveyResult = {
      accountId,
      surveyId,
      answer: 'any_answer',
      date: new Date()
    }
    await surveyResultsCollection.insertOne(surveyResult)
    return surveyResult
  }

  const makeSut = (): SurveyResultMongoRepository => {
    return new SurveyResultMongoRepository()
  }

  describe('save()', () => {
    test('Should add a survey result if its new', async () => {
      const account = await makeAccount()
      const survey = await makeSurvey()
      const sut = makeSut()
      const surveyResult = await sut.save({
        accountId: account._id,
        surveyId: survey._id,
        answer: survey.answers[0].answer,
        date: new Date()
      })
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.id).toBeTruthy()
      expect(surveyResult.answer).toBe(survey.answers[0].answer)
    })

    test('Should update survey result if its not new', async () => {
      const surveyResult = await makeSurveyResultWithAccountIdAndSurveyId('any_account_id', 'any_survey_id')
      const sut = makeSut()
      const surveyResultResponse = await sut.save({
        accountId: surveyResult.accountId,
        surveyId: surveyResult.surveyId,
        answer: 'updated_answer',
        date: new Date()
      })

      expect(surveyResultResponse).toBeTruthy()
      expect(surveyResultResponse.id).toEqual(surveyResult._id)
      expect(surveyResultResponse.answer).toBe('updated_answer')
    })
  })
})
