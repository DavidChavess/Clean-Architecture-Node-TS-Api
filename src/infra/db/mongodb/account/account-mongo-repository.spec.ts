import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account-mongo-repository'

const makeAddAccountModel = (): any => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
})

describe('Account Mongo Repository', () => {
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

  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository()
  }

  describe('add()', () => {
    test('Should return an account on add success', async () => {
      const sut = makeSut()
      const response = await sut.add(makeAddAccountModel())
      expect(response).toBeTruthy()
      expect(response.id).toBeTruthy()
      expect(response.name).toBe('any_name')
      expect(response.email).toBe('any_email@mail.com')
      expect(response.password).toBe('any_password')
    })
  })

  describe('loadByEmail()', () => {
    test('Should return an account on loadByEmail success', async () => {
      const sut = makeSut()
      await accountCollection.insertOne(makeAddAccountModel())
      const response = await sut.loadByEmail('any_email@mail.com')
      expect(response).toBeTruthy()
      expect(response?.id).toBeTruthy()
      expect(response?.name).toBe('any_name')
      expect(response?.email).toBe('any_email@mail.com')
      expect(response?.password).toBe('any_password')
    })

    test('Should return null if loadByEmail fails', async () => {
      const sut = makeSut()
      const response = await sut.loadByEmail('any_email@mail.com')
      expect(response).toBeFalsy()
    })
  })

  describe('updateAccessToken()', () => {
    test('Should update the account accessToken on updateAccessToken success', async () => {
      const sut = makeSut()
      let account = makeAddAccountModel()
      await accountCollection.insertOne(account)
      expect(account.accessToken).toBeFalsy()
      const id = account._id
      await sut.updateAccessToken(id, 'any_token')
      account = await accountCollection.findOne({ _id: id })
      expect(account).toBeTruthy()
      expect(account.accessToken).toBe('any_token')
    })
  })

  describe('loadByToken()', () => {
    test('Should return an account on loadByToken success without role', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        accessToken: 'any_token'
      })
      const response = await sut.loadByToken('any_token')
      expect(response).toBeTruthy()
      expect(response?.id).toBeTruthy()
      expect(response?.name).toBe('any_name')
      expect(response?.email).toBe('any_email@mail.com')
      expect(response?.password).toBe('any_password')
    })

    test('Should return an account on loadByToken success with role', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        accessToken: 'any_token',
        role: 'any_role'
      })
      const response = await sut.loadByToken('any_token', 'any_role')
      expect(response).toBeTruthy()
      expect(response?.id).toBeTruthy()
      expect(response?.name).toBe('any_name')
      expect(response?.email).toBe('any_email@mail.com')
      expect(response?.password).toBe('any_password')
    })
  })
})
