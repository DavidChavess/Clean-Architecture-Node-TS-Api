import { MongoHelper as sut } from './mongo-helper'

describe('Mongo Helper', () => {
  beforeAll(async () => {
    await sut.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await sut.disconnect()
  })

  test('Should reconect if mongodb is down', async () => {
    let collection = await sut.getCollection('accounts')
    expect(collection).toBeTruthy()
    await sut.disconnect()
    collection = await sut.getCollection('accounts')
    expect(collection).toBeTruthy()
  })
})
