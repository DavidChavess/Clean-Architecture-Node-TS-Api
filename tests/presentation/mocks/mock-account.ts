import { AddAccount, LoadAccountByToken, Authentication } from '@/domain/usecases'

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
    async load (accessToken: string, role?: string): Promise<LoadAccountByToken.Result | null> {
      return { id: 'any_id' }
    }
  }
  return new LoadAccountByTokenStub()
}

export const mockAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (authenticationParams: Authentication.Params): Promise<Authentication.Result | null> {
      return { name: 'any_name', accessToken: 'any_token' }
    }
  }
  return new AuthenticationStub()
}
