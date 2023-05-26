import app from '@/main/config/app'
import env from '@/main/config/env'
import { MongoHelper } from '@/infra/db'
import { sign } from 'jsonwebtoken'
import { Collection } from 'mongodb'
import request from 'supertest'

const makeAddSurvey = (): any => ({
  question: 'any_question',
  answers: [
    {
      image: 'https://any_image-1.com',
      answer: 'any_answer'
    },
    {
      image: 'https://any_image-1.com',
      answer: 'any_answer'
    }
  ]
})

describe('Survey - Routes', () => {
  let surveyCollection: Collection
  let accountCollection: Collection

  const makeAccessToken = async (): Promise<string> => {
    const account: any = {
      name: 'User',
      email: 'user@mail.com',
      password: 'any_password',
      role: 'admin'
    }
    await accountCollection.insertOne(account)

    const id = account._id
    const accessToken = sign({ id }, env.jwtSecret)
    await accountCollection.updateOne({ _id: id }, { $set: { accessToken } })
    return accessToken
  }

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('POST /surveys', () => {
    test('Should return 403 on add survey without accessToken', async () => {
      await request(app)
        .post('/api/surveys')
        .send(makeAddSurvey())
        .expect(403)
    })

    test('Should return 204 on add survey with valid accessToken', async () => {
      await request(app)
        .post('/api/surveys')
        .set('x-access-token', await makeAccessToken())
        .send(makeAddSurvey())
        .expect(204)
    })
  })

  describe('GET /surveys', () => {
    test('Should return 403 on load surveys without accessToken', async () => {
      await request(app)
        .get('/api/surveys')
        .expect(403)
    })

    test('Should return 200 on load surveys with valid accessToken', async () => {
      await surveyCollection.insertOne(makeAddSurvey())

      await request(app)
        .get('/api/surveys')
        .set('x-access-token', await makeAccessToken())
        .expect(200)
    })
  })
})
