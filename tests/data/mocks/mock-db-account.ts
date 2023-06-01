import { AddAccountRepository, LoadAccountByEmailRepository, LoadAccountByTokenRepository, UpdateAccessTokenRepository } from '@/data/protocols/db'

export class AddAccountRepositorySpy implements AddAccountRepository {
  params: AddAccountRepository.Params
  result: AddAccountRepository.Result = true

  async add (accountData: AddAccountRepository.Params): Promise<AddAccountRepository.Result> {
    this.params = accountData
    return this.result
  }
}

export class LoadAccountByEmailRepositorySpy implements LoadAccountByEmailRepository {
  param: string
  result: LoadAccountByEmailRepository.Result | null = {
    id: 'any_id',
    name: 'any_name',
    password: 'hashed_password'
  }

  async loadByEmail (email: string): Promise<LoadAccountByEmailRepository.Result | null> {
    this.param = email
    return this.result
  }
}

export class LoadAccountByTokenRepositorySpy implements LoadAccountByTokenRepository {
  token: string
  result: LoadAccountByTokenRepository.Result | null = { id: 'any_id' }

  async loadByToken (token: string): Promise<LoadAccountByTokenRepository.Result | null> {
    this.token = token
    return this.result
  }
}

export class UpdateAccessTokenRepositorySpy implements UpdateAccessTokenRepository {
  id: string
  token: string

  async updateAccessToken (id: string, token: string): Promise<void> {
    this.id = id
    this.token = token
  }
}
