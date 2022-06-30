import { AccountModel, AddAccount, AddAccountModel, Encrypter } from './db-add-account-protocol'

export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter

  constructor (encrypter: Encrypter) {
    this.encrypter = encrypter
  }

  async add (account: AddAccountModel): Promise<AccountModel> {
    const AccountModel = {
      id: 'id',
      name: 'name',
      email: 'email',
      password: 'pass'
    }
    await this.encrypter.encrypter(account.password)
    return await new Promise(resolve => resolve(AccountModel))
  }
}
