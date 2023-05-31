import { AccountModel } from '@/domain/models/account-model'
import { AuthenticationModel } from '@/domain/models/authentication-model'
import { AddAccount } from '@/domain/usecases/add-account'
import { LoadAccountByToken } from '@/domain/usecases/load-account-by-token'
import { Authentication, AuthenticationParams } from '@/domain/usecases/authentication'
import { mockAccountModel } from '@/tests/domain/mocks'

export const mockAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccount.Params): Promise<AddAccount.Result> {
      return true
    }
  }
  return new AddAccountStub()
}

export const mockLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load (accessToken: string, role?: string): Promise<AccountModel | null> {
      return mockAccountModel()
    }
  }
  return new LoadAccountByTokenStub()
}

export const mockAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (authenticationParams: AuthenticationParams): Promise<AuthenticationModel | null> {
      return { name: 'any_name', accessToken: 'any_token' }
    }
  }
  return new AuthenticationStub()
}
