import app from '../config/app'
import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'

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

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
  })

  describe('POST /surveys', () => {
    test('Should return 204 on add survey', async () => {
      await request(app)
        .post('/api/surveys')
        .send(makeAddSurvey())
        .expect(204)
    })
  })
})
