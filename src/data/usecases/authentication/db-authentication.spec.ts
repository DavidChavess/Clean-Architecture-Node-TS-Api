import { LoadAccountByEmailRepository } from '../../protocols/load-account-by-email-repository'
import { AccountModel } from '../../../domain/models/account-model'
import { DbAuthentication } from './db-authentication'

class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
  async load (email: string): Promise<AccountModel> {
    return {
      id: 'any_id',
      email: 'any_email@mail.com',
      name: 'any_name',
      password: 'any_pass'
    }
  }
}

describe('DbAuthentication', () => {
  let _sut: DbAuthentication
  let _loadAccountByEmailRepositoryStub: LoadAccountByEmailRepositoryStub

  beforeEach(() => {
    _loadAccountByEmailRepositoryStub = new LoadAccountByEmailRepositoryStub()
    _sut = new DbAuthentication(_loadAccountByEmailRepositoryStub)
  })

  test('Should call loadAccountByEmailRepository with correct email', async () => {
    const loadAccountSpy = jest.spyOn(_loadAccountByEmailRepositoryStub, 'load')
    await _sut.auth({ email: 'any_email@mail.com', password: 'any_pass' })
    expect(loadAccountSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
})
