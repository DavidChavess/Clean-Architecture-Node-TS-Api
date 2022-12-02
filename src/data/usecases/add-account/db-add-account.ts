import { AccountModel, AddAccount, AddAccountModel, Hasher, AddAccountRepository } from './db-add-account-protocol'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepo: AddAccountRepository
  ) {}

  async add (account: AddAccountModel): Promise<AccountModel> {
    const password = await this.hasher.hash(account.password)
    const { name, email } = account
    return await this.addAccountRepo.add({ name, email, password })
  }
}
