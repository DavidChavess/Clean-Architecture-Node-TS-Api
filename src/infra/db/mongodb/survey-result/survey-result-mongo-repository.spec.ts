import { Collection } from 'mongodb'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { SurveyResultMongoRepository } from './survey-result-mongo-repository'
import MockDate from 'mockdate'
import { mockAddSurveyParams } from '@/domain/test'

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
    const survey = mockAddSurveyParams()
    await surveyCollection.insertOne(survey)
    return survey
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
      expect(surveyResult.answers[0].answer).toBe(survey.answers[0].answer)
      expect(surveyResult.answers[0].count).toBe(1)
      expect(surveyResult.answers[0].percent).toBe(100)
    })

    test('Should update survey result if its not new', async () => {
      const account = await makeAccount()
      const survey = await makeSurvey()
      const surveyResult = {
        accountId: account._id,
        surveyId: survey._id,
        answer: survey.answers[0].answer,
        date: new Date()
      }
      await surveyResultsCollection.insertOne(surveyResult)

      expect(surveyResult).toBeTruthy()

      const sut = makeSut()
      const surveyResultResponse = await sut.save({
        accountId: account._id,
        surveyId: survey._id,
        answer: survey.answers[1].answer,
        date: new Date()
      })

      expect(surveyResultResponse).toBeTruthy()
      expect(surveyResultResponse.answers[0].answer).toBe(survey.answers[1].answer)
      expect(surveyResultResponse.answers[0].count).toBe(1)
      expect(surveyResultResponse.answers[0].percent).toBe(100)
    })
  })
})
