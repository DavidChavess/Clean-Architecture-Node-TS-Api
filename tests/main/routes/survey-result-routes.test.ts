import app from '@/main/config/app'
import env from '@/main/config/env'
import { MongoHelper } from '@/infra/db'
import { sign } from 'jsonwebtoken'
import { Collection } from 'mongodb'
import request from 'supertest'

describe('SurveyResult - Routes', () => {
  let surveyCollection: Collection
  let accountCollection: Collection

  const makeAccessToken = async (): Promise<string> => {
    const account: any = {
      name: 'User',
      email: 'user@mail.com',
      password: 'any_password'
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

  describe('PUT /surveys/:surveyId/results', () => {
    test('Should return 403 on save survey result without accessToken', async () => {
      await request(app)
        .put('/api/surveys/any_id/results')
        .send({
          answer: 'any_answer'
        })
        .expect(403)
    })

    test('Should return 200 on save survey result with accessToken', async () => {
      const survey: any = {
        question: 'any_question',
        answers: [
          {
            image: 'https://any_image-1.com',
            answer: 'any_answer'
          }
        ],
        date: new Date()
      }
      await surveyCollection.insertOne(survey)
      await request(app)
        .put(`/api/surveys/${survey._id}/results`)
        .set('x-access-token', await makeAccessToken())
        .send({
          answer: 'any_answer'
        })
        .expect(200)
    })
  })

  describe('GET /surveys/:surveyId/results', () => {
    test('Should return 403 on load survey result without accessToken', async () => {
      await request(app)
        .get('/api/surveys/any_id/results')
        .expect(403)
    })

    test('Should return 200 on load survey result with accessToken', async () => {
      const survey: any = {
        question: 'any_question',
        answers: [
          {
            image: 'https://any_image-1.com',
            answer: 'any_answer_1'
          },
          {
            image: 'https://any_image-1.com',
            answer: 'any_answer_2'
          },
          {
            image: 'https://any_image-1.com',
            answer: 'any_answer_3'
          },
          {
            image: 'https://any_image-1.com',
            answer: 'any_answer_4'
          }
        ],
        date: new Date()
      }
      await surveyCollection.insertOne(survey)
      await request(app)
        .get(`/api/surveys/${survey._id}/results`)
        .set('x-access-token', await makeAccessToken())
        .expect(200)
    })
  })
})
