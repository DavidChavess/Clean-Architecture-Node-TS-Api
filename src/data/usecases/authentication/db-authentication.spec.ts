import { DbAuthentication } from './db-authentication'
import {
  AccountModel,
  LoadAccountByEmailRepository,
  HashComparer,
  Encrypter,
  UpdateAccessTokenRepository
} from './db-authentication-protocols'

class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
  async loadByEmail (email: string): Promise<AccountModel | null> {
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

class EncrypterStub implements Encrypter {
  async encrypt (value: string): Promise<string> {
    return 'any_token'
  }
}

class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
  async updateAccessToken (id: string, token: string): Promise<void> {
  }
}

describe('DbAuthentication', () => {
  let _sut: DbAuthentication
  let _hashComparerStub: HashComparerStub
  let _loadAccountByEmailRepositoryStub: LoadAccountByEmailRepositoryStub
  let _encrypterStub: EncrypterStub
  let _updateAccessTokenStub: UpdateAccessTokenRepositoryStub

  beforeEach(() => {
    _loadAccountByEmailRepositoryStub = new LoadAccountByEmailRepositoryStub()
    _hashComparerStub = new HashComparerStub()
    _encrypterStub = new EncrypterStub()
    _updateAccessTokenStub = new UpdateAccessTokenRepositoryStub()
    _sut = new DbAuthentication(_loadAccountByEmailRepositoryStub, _hashComparerStub, _encrypterStub, _updateAccessTokenStub)
  })

  test('Should call loadAccountByEmailRepository with correct email', async () => {
    const loadAccountSpy = jest.spyOn(_loadAccountByEmailRepositoryStub, 'loadByEmail')
    await _sut.auth({ email: 'any_email@mail.com', password: 'any_pass' })
    expect(loadAccountSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('Should throw if loadAccountByEmailRepository throws', async () => {
    jest.spyOn(_loadAccountByEmailRepositoryStub, 'loadByEmail').mockRejectedValueOnce(new Error())
    const promise = _sut.auth({ email: 'any_email@mail.com', password: 'any_pass' })
    await expect(promise).rejects.toThrow()
  })

  test('Should return null if loadAccountByEmailRepository return null', async () => {
    jest.spyOn(_loadAccountByEmailRepositoryStub, 'loadByEmail').mockResolvedValueOnce(null)
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

  test('Should call Encrypter with correct values', async () => {
    const encrypterSpy = jest.spyOn(_encrypterStub, 'encrypt')
    await _sut.auth({ email: 'any_email@mail.com', password: 'any_password' })
    expect(encrypterSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should throw if Encrypter throws', async () => {
    jest.spyOn(_encrypterStub, 'encrypt').mockImplementationOnce(() => {
      throw new Error()
    })
    await expect(_sut.auth({ email: 'any_email@mail.com', password: 'any_password' }))
      .rejects.toThrow()
  })

  test('Should return a token on success', async () => {
    const response = await _sut.auth({ email: 'any_email@mail.com', password: 'any_password' })
    expect(response).toBe('any_token')
  })

  test('Should call UpdateAcessTokenRepository with correct values', async () => {
    const updateAccessTokenSpy = jest.spyOn(_updateAccessTokenStub, 'updateAccessToken')
    await _sut.auth({ email: 'any_email@mail.com', password: 'any_password' })
    expect(updateAccessTokenSpy).toHaveBeenCalledWith('any_id', 'any_token')
  })

  test('Should throw if UpdateAcessTokenRepository throws', async () => {
    jest.spyOn(_updateAccessTokenStub, 'updateAccessToken').mockImplementationOnce(() => {
      throw new Error()
    })
    await expect(_sut.auth({ email: 'any_email@mail.com', password: 'any_password' }))
      .rejects.toThrow()
  })
})
