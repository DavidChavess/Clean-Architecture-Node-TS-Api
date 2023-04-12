import { DbAuthentication } from './db-authentication'
import { LoadAccountByEmailRepository, HashComparer, Encrypter, UpdateAccessTokenRepository } from './db-authentication-protocols'
import { mockEncrypter, mockHashComparer, mockLoadAccountByEmailRepository, mockUpdateAccessTokenRepository } from '@/data/test'

describe('DbAuthentication', () => {
  let _sut: DbAuthentication
  let _hashComparerStub: HashComparer
  let _loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  let _encrypterStub: Encrypter
  let _updateAccessTokenStub: UpdateAccessTokenRepository

  beforeEach(() => {
    _loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository()
    _hashComparerStub = mockHashComparer()
    _encrypterStub = mockEncrypter()
    _updateAccessTokenStub = mockUpdateAccessTokenRepository()
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
    jest.spyOn(_encrypterStub, 'encrypt').mockRejectedValueOnce(new Error())
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
    jest.spyOn(_updateAccessTokenStub, 'updateAccessToken').mockRejectedValueOnce(new Error())
    await expect(_sut.auth({ email: 'any_email@mail.com', password: 'any_password' }))
      .rejects.toThrow()
  })
})
