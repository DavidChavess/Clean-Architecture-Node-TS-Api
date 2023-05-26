import app from '@/main/config/app'
import { MongoHelper } from '@/infra/db'
import { Collection } from 'mongodb'
import bcrypt from 'bcrypt'
import request from 'supertest'

const makeAccount = (): any => ({
  name: 'David',
  email: 'david@gmail.com',
  password: '123',
  passwordConfirmation: '123'
})

describe('Login - Routes', () => {
  let accountCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('POST /signup', () => {
    test('Should return 201 on signup', async () => {
      await request(app)
        .post('/api/signup')
        .send(makeAccount())
        .expect(201)
    })
  })

  describe('POST /login', () => {
    test('Should return 200 on login', async () => {
      const password = await bcrypt.hash('123', 12)
      await accountCollection.insertOne({
        name: 'David',
        email: 'david@gmail.com',
        password
      })
      await request(app)
        .post('/api/login')
        .send({
          email: 'david@gmail.com',
          password: '123'
        })
        .expect(200)
    })

    test('Should return 401 on login', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'david@gmail.com',
          password: '123'
        })
        .expect(401)
    })
  })
})
