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

  describe('Login Query', () => {
    const query = `query {
      login (email: "any_email@gmail.com", password: "any_password") {
        accessToken
        name
      }
    }`
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

    test('Should return an Unauthorized on invalid credentials is provided', async () => {
      const { status, body } = await request(app)
        .post('/graphql')
        .send({ query })

      expect(status).toBe(401)
      expect(body.data).toBeFalsy()
      expect(body.errors[0].message).toBe('Unauthorized')
    })
  })

  describe('SignUp Mutation', () => {
    const query = `mutation {
      signUp (name: "any_name", email: "any_email@gmail.com", password: "any_password", passwordConfirmation: "any_password") {
        accessToken
        name
      }
    }
    `
    test('Should create an account on valid data', async () => {
      const { status, body: { data: { signUp } } } = await request(app)
        .post('/graphql')
        .send({ query })

      expect(status).toBe(200)
      expect(signUp.name).toBe('any_name')
      expect(signUp.accessToken).toBeTruthy()
    })

    test('Should return EmailInUseError on invalid data', async () => {
      const account = mockAccount()
      const password = await bcrypt.hash(account.password, 12)
      await accountCollection.insertOne({ ...account, password })

      const { status, body } = await request(app)
        .post('/graphql')
        .send({ query })

      expect(status).toBe(403)
      expect(body.data).toBeFalsy()
      expect(body.errors[0].message).toBe('The received email is already is use')
    })
  })
})
