import { AddAccount } from '@/domain/usecases'
import { Hasher, AddAccountRepository, LoadAccountByEmailRepository } from '@/data/protocols'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepo: AddAccountRepository,
    private readonly loadAccountByEmailRepo: LoadAccountByEmailRepository
  ) {}

  async add (params: AddAccount.Params): Promise<AddAccount.Result> {
    const account = await this.loadAccountByEmailRepo.loadByEmail(params.email)
    if (!account) {
      const password = await this.hasher.hash(params.password)
      return this.addAccountRepo.add({ ...params, password })
    }
    return false
  }
}
