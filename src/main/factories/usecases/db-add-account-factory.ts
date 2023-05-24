import { AddAccount } from '@/domain/usecases/add-account'
import { DbAddAccount } from '@/data/usecases/db-add-account'
import { BcryptAdapter } from '@/infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository'

export const makeDbAddAccount = (): AddAccount => {
  const addAccountRepository = new AccountMongoRepository()
  const salt = 12
  const hasher = new BcryptAdapter(salt)
  return new DbAddAccount(hasher, addAccountRepository, addAccountRepository)
}
