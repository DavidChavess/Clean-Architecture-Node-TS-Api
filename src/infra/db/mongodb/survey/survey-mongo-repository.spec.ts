import { Collection } from 'mongodb'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-mongo-repository'
import MockDate from 'mockdate'
import { mockAddAccountParams, mockAddSurveyParams } from '@/domain/test'

describe('Survey Mongo Repository', () => {
  let surveyCollection: Collection
  let surveyResultsCollection: Collection
  let accountCollection: Collection

  const makeAccount = async (): Promise<any> => {
    const account = mockAddAccountParams()
    await accountCollection.insertOne(account)
    return account
  }

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
    surveyResultsCollection = await MongoHelper.getCollection('surveyResults')
    accountCollection = await MongoHelper.getCollection('accounts')

    await Promise.all([
      surveyResultsCollection.deleteMany({}),
      surveyCollection.deleteMany({}),
      accountCollection.deleteMany({})
    ])
  })

  const makeSut = (): SurveyMongoRepository => {
    return new SurveyMongoRepository()
  }

  describe('add()', () => {
    test('Should add a new survey on add success', async () => {
      const sut = makeSut()
      await sut.add(mockAddSurveyParams())
      const response = await surveyCollection.findOne({ question: 'any_question' })
      expect(response).toBeTruthy()
    })
  })

  describe('loadAll()', () => {
    test('Should return a list of surveys on success', async () => {
      const account: any = await makeAccount()
      const surveys: any[] = [mockAddSurveyParams(), mockAddSurveyParams()]
      await surveyCollection.insertMany(surveys)

      await surveyResultsCollection.insertOne({
        accountId: account._id,
        surveyId: surveys[0]._id,
        date: new Date(),
        answer: surveys[0].answers[0].answer
      })

      const sut = makeSut()
      const surveysResult = await sut.loadAll(account._id)

      expect(surveysResult.length).toBe(2)
      expect(surveysResult[0].id).toBeTruthy()
      expect(surveysResult[0].question).toBe(surveys[0].question)
      expect(surveysResult[0].didAnswer).toBe(true)
      expect(surveysResult[1].id).toBeTruthy()
      expect(surveysResult[1].question).toBe(surveys[1].question)
      expect(surveysResult[1].didAnswer).toBe(false)
    })

    test('Should load empty list', async () => {
      const account = await makeAccount()
      const sut = makeSut()
      const surveys = await sut.loadAll(account._id)
      expect(surveys.length).toBe(0)
    })
  })

  describe('loadById()', () => {
    test('Should return a survey by id with success', async () => {
      const surveyModel: any = mockAddSurveyParams()
      await surveyCollection.insertOne(surveyModel)

      const sut = makeSut()
      const survey = await sut.loadById(surveyModel._id)

      expect(survey).toBeTruthy()
      expect(survey.question).toBe('any_question')
    })
  })
})
