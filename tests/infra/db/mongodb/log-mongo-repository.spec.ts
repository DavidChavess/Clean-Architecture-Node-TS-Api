import { Collection } from 'mongodb'
import { MongoHelper, LogMongoRepository } from '@/infra/db'

describe('Log Mongo Repository', () => {
  let _errorCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    _errorCollection = await MongoHelper.getCollection('errors')
    await _errorCollection.deleteMany({})
  })

  const makeSut = (): LogMongoRepository => {
    return new LogMongoRepository()
  }

  test('Should create an error log on success', async () => {
    await makeSut().log('any_stack')
    const count = await _errorCollection.countDocuments()
    expect(count).toBe(1)
  })
})
