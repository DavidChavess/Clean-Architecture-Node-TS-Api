import { AccountModel, AddAccount, AddAccountModel, Encrypter, AddAccountRepository } from './db-add-account-protocol'

export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter
  private readonly addAccountRepo: AddAccountRepository

  constructor (encrypter: Encrypter, addAccountRepo: AddAccountRepository) {
    this.encrypter = encrypter
    this.addAccountRepo = addAccountRepo
  }

  async add (account: AddAccountModel): Promise<AccountModel> {
    const password = await this.encrypter.encrypter(account.password)
    const { name, email } = account
    return await this.addAccountRepo.add({ name, email, password })
  }
}
