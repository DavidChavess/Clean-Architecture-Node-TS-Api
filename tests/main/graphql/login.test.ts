import app from '@/main/config/app'
import { MongoHelper } from '@/infra/db'
import { Collection } from 'mongodb'
import bcrypt from 'bcrypt'
import request from 'supertest'

const mockAccount = (): any => ({
  name: 'any_name',
  email: 'any_email@gmail.com',
  password: 'any_password'
})

describe('Auth GraphQL', () => {
  let accountCollection: Collection
  const query = `query {
    login (email: "any_email@gmail.com", password: "any_password") {
      accessToken
      name
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
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('POST /login', () => {
    test('Should return an account on valid credentials is provided', async () => {
      const account = mockAccount()
      const password = await bcrypt.hash(account.password, 12)
      await accountCollection.insertOne({ ...account, password })

      const { status, body: { data: { login } } } = await request(app)
        .post('/graphql')
        .send({ query })

      expect(status).toBe(200)
      expect(login.name).toBe(account.name)
      expect(login.accessToken).toBeTruthy()
    })
  })
})
