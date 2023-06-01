import { DbAuthentication } from '@/data/usecases'
import { EncrypterSpy, HashComparerSpy, LoadAccountByEmailRepositorySpy, UpdateAccessTokenRepositorySpy } from '@/tests/data/mocks'
import { mockAuthenticationParams, throwError } from '@/tests/domain/mocks'

describe('DbAuthentication', () => {
  let _sut: DbAuthentication
  let _hashComparerSpy: HashComparerSpy
  let _loadAccountByEmailRepositorySpy: LoadAccountByEmailRepositorySpy
  let _encrypterSpy: EncrypterSpy
  let _updateAccessTokenSpy: UpdateAccessTokenRepositorySpy

  beforeEach(() => {
    _loadAccountByEmailRepositorySpy = new LoadAccountByEmailRepositorySpy()
    _hashComparerSpy = new HashComparerSpy()
    _encrypterSpy = new EncrypterSpy()
    _updateAccessTokenSpy = new UpdateAccessTokenRepositorySpy()
    _sut = new DbAuthentication(_loadAccountByEmailRepositorySpy, _hashComparerSpy, _encrypterSpy, _updateAccessTokenSpy)
  })

  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const authenticationParams = mockAuthenticationParams()
    await _sut.auth(authenticationParams)
    expect(_loadAccountByEmailRepositorySpy.param).toBe(authenticationParams.email)
  })

  test('Should throw if LoadAccountByEmailRepository throws', async () => {
    jest.spyOn(_loadAccountByEmailRepositorySpy, 'loadByEmail').mockImplementationOnce(throwError)
    await expect(_sut.auth(mockAuthenticationParams())).rejects.toThrow()
  })

  test('Should return null if LoadAccountByEmailRepository return null', async () => {
    _loadAccountByEmailRepositorySpy.result = null
    const response = await _sut.auth(mockAuthenticationParams())
    expect(response).toBeNull()
  })

  test('Should call HashComparator with correct values', async () => {
    const authenticationParams = mockAuthenticationParams()
    await _sut.auth(authenticationParams)
    expect(_hashComparerSpy.value).toBe(authenticationParams.password)
    expect(_hashComparerSpy.hash).toBe(_loadAccountByEmailRepositorySpy.result?.password)
  })

  test('Should return null if HashComparator returns false', async () => {
    _hashComparerSpy.result = false
    const response = await _sut.auth(mockAuthenticationParams())
    expect(response).toBeNull()
  })

  test('Should call Encrypter with correct values', async () => {
    await _sut.auth(mockAuthenticationParams())
    expect(_encrypterSpy.param).toBe(_loadAccountByEmailRepositorySpy.result?.id)
  })

  test('Should throw if Encrypter throws', async () => {
    jest.spyOn(_encrypterSpy, 'encrypt').mockImplementationOnce(throwError)
    await expect(_sut.auth(mockAuthenticationParams())).rejects.toThrow()
  })

  test('Should return an AuthenticationModel on success', async () => {
    const response = await _sut.auth(mockAuthenticationParams())
    expect(response?.accessToken).toBe(_encrypterSpy.result)
    expect(response?.name).toBe(_loadAccountByEmailRepositorySpy.result?.name)
  })

  test('Should call UpdateAcessTokenRepository with correct values', async () => {
    await _sut.auth(mockAuthenticationParams())
    expect(_updateAccessTokenSpy.id).toBe(_loadAccountByEmailRepositorySpy.result?.id)
    expect(_updateAccessTokenSpy.token).toBe(_encrypterSpy.result)
  })

  test('Should throw if UpdateAcessTokenRepository throws', async () => {
    jest.spyOn(_updateAccessTokenSpy, 'updateAccessToken').mockImplementationOnce(throwError)
    await expect(_sut.auth(mockAuthenticationParams())).rejects.toThrow()
  })
})
