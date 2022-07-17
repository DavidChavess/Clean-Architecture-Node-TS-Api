import { InsertOneResult } from 'mongodb'
import { AccountModel } from '../../../../domain/models/account-model'
import { AddAccountModel } from '../../../../domain/usecases/add-account'

export const map = (account: AddAccountModel, resultBd: InsertOneResult): AccountModel => {
  const id = resultBd.insertedId.toString()
  return Object.assign({}, account, { id })
}
