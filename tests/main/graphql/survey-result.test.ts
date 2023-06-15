import app from '@/main/config/app'
import request from 'supertest'
import { MongoHelper } from '@/infra/db'
import { Collection } from 'mongodb'
import { mockSurveyParams, mockAccessToken } from '@/tests/main/graphql/mocks'

describe('SurveyResult GraphQL', () => {
  let surveyCollection: Collection
  let accountCollection: Collection

  const query = (surveyId?: string): string => `query {
    surveyResult (surveyId: "${surveyId}") {
      question
      answers {
        answer
        count
        percent
        isCurrentAccountAnswer
      }
      date
    }
  }
  `

  const mutation = (surveyId?: string, answer?: string): string => `mutation {
    saveSurveyResult (surveyId: "${surveyId}", answer: "${answer}") {
      question
      answers {
        answer
        count
        percent
        isCurrentAccountAnswer
      }
      date
    }
  }
  `

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    accountCollection = await MongoHelper.getCollection('accounts')

    await Promise.all([
      surveyCollection.deleteMany({}),
      accountCollection.deleteMany({})
    ])
  })

  describe('surveyResult Query', () => {
    test('Should return 403 on load surveyResult without accessToken', async () => {
      await request(app)
        .post('/graphql')
        .send({ query: query() })
        .expect(403)
    })

    test('Should return 200 on load surveyResult with valid accessToken', async () => {
      const date = new Date()
      const survey = { ...mockSurveyParams(), date }
      await surveyCollection.insertOne(survey)

      const { status, body: { data: { surveyResult } } } = await request(app)
        .post('/graphql')
        .set('x-access-token', await mockAccessToken(accountCollection))
        .send({ query: query(survey._id) })

      expect(surveyResult.question).toBe(survey.question)
      expect(surveyResult.date).toBe(date.toISOString())
      expect(surveyResult.answers).toEqual([
        {
          answer: 'any_answer',
          count: 0,
          percent: 0,
          isCurrentAccountAnswer: false
        },
        {
          answer: 'any_answer_2',
          count: 0,
          percent: 0,
          isCurrentAccountAnswer: false
        }
      ])
      expect(status).toBe(200)
    })
  })

  describe('saveSurveyResult Mutation', () => {
    test('Should return 403 on saveSurveyResult without accessToken', async () => {
      await request(app)
        .post('/graphql')
        .send({ query: mutation() })
        .expect(403)
    })

    test('Should return 200 on save surveyResult with valid accessToken', async () => {
      const date = new Date()
      const survey = { ...mockSurveyParams(), date }
      await surveyCollection.insertOne(survey)

      const { status, body: { data: { saveSurveyResult } } } = await request(app)
        .post('/graphql')
        .set('x-access-token', await mockAccessToken(accountCollection))
        .send({ query: mutation(survey._id, survey.answers[0].answer) })

      expect(saveSurveyResult.question).toBe(survey.question)
      expect(saveSurveyResult.date).toBe(date.toISOString())
      expect(saveSurveyResult.answers).toEqual([
        {
          answer: 'any_answer',
          count: 1,
          percent: 100,
          isCurrentAccountAnswer: true
        },
        {
          answer: 'any_answer_2',
          count: 0,
          percent: 0,
          isCurrentAccountAnswer: false
        }
      ])
      expect(status).toBe(200)
    })
  })
})
