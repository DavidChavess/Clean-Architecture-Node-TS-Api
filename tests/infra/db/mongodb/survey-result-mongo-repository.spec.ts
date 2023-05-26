import MockDate from 'mockdate'
import { Collection, ObjectId } from 'mongodb'
import { MongoHelper, SurveyResultMongoRepository } from '@/infra/db'
import { SurveyResultListBuilder, mockAddAccountParams, mockAddSurveyParams } from '@/tests/domain/mocks'

describe('Survey Result Mongo Repository', () => {
  let surveyCollection: Collection
  let surveyResultsCollection: Collection
  let accountCollection: Collection

  const makeAccount = async (): Promise<any> => {
    const account = mockAddAccountParams()
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

  describe('save()', () => {
    test('Should add a survey result if its new', async () => {
      const sut = makeSut()
      await sut.save({
        accountId: '643ee19a8b7d94780eef6ce2',
        surveyId: '643ee19a8b7d94780eef6ce2',
        answer: 'updated_answer',
        date: new Date()
      })
      const count = await surveyResultsCollection.countDocuments()
      expect(count).toBe(1)
    })

    test('Should update survey result if its not new', async () => {
      const sut = makeSut()
      const surveyResult = {
        accountId: new ObjectId('643ee19a8b7d94780eef6ce2'),
        surveyId: new ObjectId('643ee19a8b7d94780eef6ce2'),
        answer: 'any_answer',
        date: new Date()
      }
      await surveyResultsCollection.insertOne(surveyResult)

      await sut.save({
        accountId: surveyResult.accountId.toString(),
        surveyId: surveyResult.surveyId.toString(),
        answer: 'updated_answer',
        date: new Date()
      })

      const surveyResultResponse = await surveyResultsCollection.find({
        accountId: surveyResult.accountId,
        surveyId: surveyResult.surveyId
      }).toArray()

      expect(surveyResultResponse).toBeTruthy()
      expect(surveyResultResponse.length).toBe(1)
      expect(surveyResultResponse[0].answer).toBe('updated_answer')
    })
  })

  describe('loadBySurveyId()', () => {
    test('Should load survey result', async () => {
      const account = await makeAccount()
      const account2 = await makeAccount()
      const survey = await makeSurvey()
      const surveyResults = new SurveyResultListBuilder()
        .aSeller().withAccountId(account._id).withSurveyId(survey._id).withAnswer(survey.answers[0].answer)
        .aSeller().withAccountId(account2._id).withSurveyId(survey._id).withAnswer(survey.answers[0].answer)
        .build()
      await surveyResultsCollection.insertMany(surveyResults)
      const sut = makeSut()
      const surveyResult = await sut.loadBySurveyId({ surveyId: survey._id, accountId: account._id })
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.surveyId).toEqual(survey._id)
      expect(surveyResult.answers[0].count).toBe(2)
      expect(surveyResult.answers[0].percent).toBe(100)
      expect(surveyResult.answers[0].isCurrentAccountAnswer).toBe(true)
      expect(surveyResult.answers[1].count).toBe(0)
      expect(surveyResult.answers[1].percent).toBe(0)
      expect(surveyResult.answers[1].isCurrentAccountAnswer).toBe(false)
      expect(surveyResult.answers[2].count).toBe(0)
      expect(surveyResult.answers[2].percent).toBe(0)
      expect(surveyResult.answers[2].isCurrentAccountAnswer).toBe(false)
    })

    test('Should load survey result 2', async () => {
      const account = await makeAccount()
      const account2 = await makeAccount()
      const account3 = await makeAccount()
      const survey = await makeSurvey()
      const surveyResults = new SurveyResultListBuilder()
        .aSeller().withAccountId(account._id).withSurveyId(survey._id).withAnswer(survey.answers[0].answer)
        .aSeller().withAccountId(account2._id).withSurveyId(survey._id).withAnswer(survey.answers[1].answer)
        .aSeller().withAccountId(account3._id).withSurveyId(survey._id).withAnswer(survey.answers[1].answer)
        .build()
      await surveyResultsCollection.insertMany(surveyResults)
      const sut = makeSut()
      const surveyResult = await sut.loadBySurveyId({ surveyId: survey._id, accountId: account2._id })
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.surveyId).toEqual(survey._id)
      expect(surveyResult.answers[0].count).toBe(2)
      expect(surveyResult.answers[0].percent).toBe(67)
      expect(surveyResult.answers[0].isCurrentAccountAnswer).toBe(true)
      expect(surveyResult.answers[1].count).toBe(1)
      expect(surveyResult.answers[1].percent).toBe(33)
      expect(surveyResult.answers[1].isCurrentAccountAnswer).toBe(false)
      expect(surveyResult.answers[2].count).toBe(0)
      expect(surveyResult.answers[2].percent).toBe(0)
      expect(surveyResult.answers[2].isCurrentAccountAnswer).toBe(false)
    })

    test('Should load survey result 3', async () => {
      const account = await makeAccount()
      const account2 = await makeAccount()
      const account3 = await makeAccount()
      const survey = await makeSurvey()
      const surveyResults = new SurveyResultListBuilder()
        .aSeller().withAccountId(account._id).withSurveyId(survey._id).withAnswer(survey.answers[0].answer)
        .aSeller().withAccountId(account2._id).withSurveyId(survey._id).withAnswer(survey.answers[1].answer)
        .build()
      await surveyResultsCollection.insertMany(surveyResults)
      const sut = makeSut()
      const surveyResult = await sut.loadBySurveyId({ surveyId: survey._id, accountId: account3._id })
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.surveyId).toEqual(survey._id)
      expect(surveyResult.answers[0].count).toBe(1)
      expect(surveyResult.answers[0].percent).toBe(50)
      expect(surveyResult.answers[0].isCurrentAccountAnswer).toBe(false)
      expect(surveyResult.answers[1].count).toBe(1)
      expect(surveyResult.answers[1].percent).toBe(50)
      expect(surveyResult.answers[1].isCurrentAccountAnswer).toBe(false)
      expect(surveyResult.answers[2].count).toBe(0)
      expect(surveyResult.answers[2].percent).toBe(0)
      expect(surveyResult.answers[2].isCurrentAccountAnswer).toBe(false)
    })
  })
})
