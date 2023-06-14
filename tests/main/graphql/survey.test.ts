import app from '@/main/config/app'
import env from '@/main/config/env'
import request from 'supertest'
import { sign } from 'jsonwebtoken'
import { MongoHelper } from '@/infra/db'
import { Collection } from 'mongodb'

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
  })
})
