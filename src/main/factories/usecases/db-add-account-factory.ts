import { AddAccount } from '@/domain/usecases'
import { DbAddAccount } from '@/data/usecases'
import { BcryptAdapter } from '@/infra/criptography'
import { AccountMongoRepository } from '@/infra/db'

export const makeDbAddAccount = (): AddAccount => {
  const addAccountRepository = new AccountMongoRepository()
  const salt = 12
  const hasher = new BcryptAdapter(salt)
  return new DbAddAccount(hasher, addAccountRepository, addAccountRepository)
}
