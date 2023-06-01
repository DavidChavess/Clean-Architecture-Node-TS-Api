import { Collection } from 'mongodb'
import { AccountMongoRepository, MongoHelper } from '@/infra/db'

describe('Account Mongo Repository', () => {
  let accountCollection: Collection
  let sut: AccountMongoRepository

  const mockAddAccount = (): any => ({
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password'
  })

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    sut = new AccountMongoRepository()
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('add()', () => {
    test('Should return an account on add success', async () => {
      const response = await sut.add(mockAddAccount())
      const count = await accountCollection.countDocuments()
      expect(count).toBe(1)
      expect(response).toBe(true)
    })
  })

  describe('loadByEmail()', () => {
    test('Should return an account on loadByEmail success', async () => {
      await accountCollection.insertOne(mockAddAccount())
      const response = await sut.loadByEmail('any_email@mail.com')
      expect(response).toBeTruthy()
      expect(response?.id).toBeTruthy()
      expect(response?.name).toBe('any_name')
      expect(response?.email).toBe('any_email@mail.com')
      expect(response?.password).toBe('any_password')
    })

    test('Should return null if loadByEmail fails', async () => {
      const response = await sut.loadByEmail('any_email@mail.com')
      expect(response).toBeFalsy()
    })
  })

  describe('updateAccessToken()', () => {
    test('Should update the account accessToken on updateAccessToken success', async () => {
      let account = mockAddAccount()
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
      await accountCollection.insertOne({
        ...mockAddAccount(),
        accessToken: 'any_token'
      })
      const response = await sut.loadByToken('any_token')
      expect(response).toBeTruthy()
      expect(response.id).toBeTruthy()
    })

    test('Should return an account on loadByToken success with role', async () => {
      await accountCollection.insertOne({
        ...mockAddAccount(),
        accessToken: 'any_token',
        role: 'any_role'
      })
      const response = await sut.loadByToken('any_token', 'any_role')
      expect(response).toBeTruthy()
      expect(response.id).toBeTruthy()
    })

    test('Should return an account on loadByToken success if user is admin', async () => {
      await accountCollection.insertOne({
        ...mockAddAccount(),
        accessToken: 'any_token',
        role: 'admin'
      })
      const response = await sut.loadByToken('any_token')
      expect(response).toBeTruthy()
      expect(response.id).toBeTruthy()
    })

    test('Should return null on loadByToken if user is not admin and role not is provided', async () => {
      await accountCollection.insertOne({
        ...mockAddAccount(),
        accessToken: 'any_token',
        role: 'any_role'
      })
      const response = await sut.loadByToken('any_token')
      expect(response).toBeNull()
    })

    test('Should return null if loadByToken fails', async () => {
      const response = await sut.loadByToken('any_token')
      expect(response).toBeFalsy()
    })
  })
})
