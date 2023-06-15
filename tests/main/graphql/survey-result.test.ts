import app from '@/main/config/app'
import request from 'supertest'
import { MongoHelper } from '@/infra/db'
import { Collection } from 'mongodb'

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
  })
})
