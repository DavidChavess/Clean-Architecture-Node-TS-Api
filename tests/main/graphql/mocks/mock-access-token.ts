import env from '@/main/config/env'
import { Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'
import { mockAccount } from '@/tests/main/graphql/mocks'

export const mockAccessToken = async (accountCollection: Collection): Promise<string> => {
  const account = mockAccount()
  await accountCollection.insertOne(account)

  const id = account._id
  const accessToken = sign({ id }, env.jwtSecret)
  await accountCollection.updateOne({ _id: id }, { $set: { accessToken } })
  return accessToken
}
