import { AccountModel, AddAccount, AddAccountModel, Hasher, AddAccountRepository, LoadAccountByEmailRepository } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepo: AddAccountRepository,
    private readonly loadAccountByEmailRepo: LoadAccountByEmailRepository
  ) {}

  async add (account: AddAccountModel): Promise<AccountModel | null> {
    const accountByEmail = await this.loadAccountByEmailRepo.loadByEmail(account.email)
    if (accountByEmail) {
      return null
    }
    const password = await this.hasher.hash(account.password)
    const { name, email } = account
    return await this.addAccountRepo.add({ name, email, password })
  }
}
