import { AddAccount } from '@/domain/usecases'
import { Hasher, AddAccountRepository, CheckAccountByEmailRepository } from '@/data/protocols'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepo: AddAccountRepository,
    private readonly checkAccountByEmailRepository: CheckAccountByEmailRepository
  ) {}

  async add (params: AddAccount.Params): Promise<AddAccount.Result> {
    const exists = await this.checkAccountByEmailRepository.checkByEmail(params.email)
    if (!exists) {
      const password = await this.hasher.hash(params.password)
      return this.addAccountRepo.add({ ...params, password })
    }
    return false
  }
}
