import app from '@/main/config/app'
import request from 'supertest'
import { MongoHelper } from '@/infra/db'
import { Collection } from 'mongodb'
import { mockSurveyParams, mockAccessToken } from '@/tests/main/graphql/mocks'

describe('Survey GraphQL', () => {
  let surveyCollection: Collection
  let accountCollection: Collection

  const query = `query {
    surveys {
      id
      question
      date
      didAnswer  
      answers {
        image
        answer
      }
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

  describe('surveys Query', () => {
    test('Should return 403 on load surveys without accessToken', async () => {
      await request(app)
        .post('/graphql')
        .send({ query })
        .expect(403)
    })

    test('Should return 200 on load surveys with valid accessToken', async () => {
      const date = new Date()
      const survey = { ...mockSurveyParams(), date }
      await surveyCollection.insertOne(survey)
      const { status, body: { data: { surveys } } } = await request(app)
        .post('/graphql')
        .set('x-access-token', await mockAccessToken(accountCollection))
        .send({ query })

      expect(surveys.length).toBe(1)
      expect(surveys[0].question).toBe(survey.question)
      expect(surveys[0].date).toBe(date.toISOString())
      expect(status).toBe(200)
    })
  })
})
