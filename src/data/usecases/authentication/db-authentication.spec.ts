import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import { AccountModel } from '../../../domain/models/account-model'
import { DbAuthentication } from './db-authentication'
import { HashComparer } from '../../protocols/criptography/hash-comparer'
import { TokenGenerator } from '../../protocols/criptography/token-generator'

class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
  async load (email: string): Promise<AccountModel | null> {
    return {
      id: 'any_id',
      email: 'any_email@mail.com',
      name: 'any_name',
      password: 'hashed_password'
    }
  }
}

class HashComparerStub implements HashComparer {
  async compare (value: string, hash: string): Promise<boolean> {
    return true
  }
}

class TokenGeneratorStub implements TokenGenerator {
  async generate (id: string): Promise<string> {
    return 'any_token'
  }
}

describe('DbAuthentication', () => {
  let _sut: DbAuthentication
  let _hashComparerStub: HashComparerStub
  let _loadAccountByEmailRepositoryStub: LoadAccountByEmailRepositoryStub
  let _tokenGeneratorStub: TokenGeneratorStub

  beforeEach(() => {
    _loadAccountByEmailRepositoryStub = new LoadAccountByEmailRepositoryStub()
    _hashComparerStub = new HashComparerStub()
    _tokenGeneratorStub = new TokenGeneratorStub()
    _sut = new DbAuthentication(_loadAccountByEmailRepositoryStub, _hashComparerStub, _tokenGeneratorStub)
  })

  test('Should call loadAccountByEmailRepository with correct email', async () => {
    const loadAccountSpy = jest.spyOn(_loadAccountByEmailRepositoryStub, 'load')
    await _sut.auth({ email: 'any_email@mail.com', password: 'any_pass' })
    expect(loadAccountSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('Should throw if loadAccountByEmailRepository throws', async () => {
    jest.spyOn(_loadAccountByEmailRepositoryStub, 'load').mockRejectedValueOnce(new Error())
    const promise = _sut.auth({ email: 'any_email@mail.com', password: 'any_pass' })
    await expect(promise).rejects.toThrow()
  })

  test('Should return null if loadAccountByEmailRepository return null', async () => {
    jest.spyOn(_loadAccountByEmailRepositoryStub, 'load').mockResolvedValueOnce(null)
    const response = await _sut.auth({ email: 'any_email@mail.com', password: 'any_pass' })
    expect(response).toBeNull()
  })

  test('Should call HashComparator with correct values', async () => {
    const hashSpy = jest.spyOn(_hashComparerStub, 'compare')
    await _sut.auth({ email: 'any_email@mail.com', password: 'any_password' })
    expect(hashSpy).toHaveBeenCalledWith('any_password', 'hashed_password')
  })

  test('Should return null if HashComparator returns false', async () => {
    jest.spyOn(_hashComparerStub, 'compare').mockResolvedValueOnce(false)
    const response = await _sut.auth({ email: 'any_email@mail.com', password: 'any_password' })
    expect(response).toBeNull()
  })

  test('Should call TokenGenerator with correct values', async () => {
    const tokenGenerateSpy = jest.spyOn(_tokenGeneratorStub, 'generate')
    await _sut.auth({ email: 'any_email@mail.com', password: 'any_password' })
    expect(tokenGenerateSpy).toHaveBeenCalledWith('any_id')
  })
})
