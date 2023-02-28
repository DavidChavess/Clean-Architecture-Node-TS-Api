import app from '../config/app'
import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'
import env from '../env'

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
      const account: any = {
        name: 'User-admin',
        email: 'admin@mail.com',
        password: 'any_password',
        role: 'admin'
      }

      await accountCollection.insertOne(account)

      const id = account._id
      const accessToken = sign({ id }, env.jwtSecret)
      await accountCollection.updateOne({ _id: id }, { $set: { accessToken } })

      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
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
  })
})
