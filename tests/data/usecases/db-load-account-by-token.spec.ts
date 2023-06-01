import { DbLoadAccountByToken } from '@/data/usecases'
import { DecrypterSpy, LoadAccountByTokenRepositorySpy } from '@/tests/data/mocks'
import { throwError } from '@/tests/domain/mocks'

describe('DbLoadAccountByToken Usecase', () => {
  let _sut: DbLoadAccountByToken
  let _decrypterSpy: DecrypterSpy
  let _loadAccountByTokenRepositorySpy: LoadAccountByTokenRepositorySpy

  beforeEach(() => {
    _decrypterSpy = new DecrypterSpy()
    _loadAccountByTokenRepositorySpy = new LoadAccountByTokenRepositorySpy()
    _sut = new DbLoadAccountByToken(_decrypterSpy, _loadAccountByTokenRepositorySpy)
  })

  test('Should call Decrypter with correct value', async () => {
    await _sut.load('any_token', 'any_role')
    expect(_decrypterSpy.param).toBe('any_token')
  })

  test('Should returns null if Decrypter returns null', async () => {
    _decrypterSpy.result = null
    const response = await _sut.load('any_token', 'any_role')
    expect(response).toBeNull()
  })

  test('Should returns null if Decrypter throws', async () => {
    jest.spyOn(_decrypterSpy, 'decrypt').mockImplementationOnce(throwError)
    const token = await _sut.load('any_token', 'any_role')
    expect(token).toBeNull()
  })

  test('Should calls LoadAccountByTokenRepository with correct values', async () => {
    await _sut.load('any_token', 'any_role')
    expect(_loadAccountByTokenRepositorySpy.token).toBe('any_token')
  })

  test('Should returns null if LoadAccountByTokenRepository returns null', async () => {
    _loadAccountByTokenRepositorySpy.result = null
    const response = await _sut.load('any_token', 'any_role')
    expect(response).toBeNull()
  })

  test('Should throws if LoadAccountByTokenRepository throws', async () => {
    jest.spyOn(_loadAccountByTokenRepositorySpy, 'loadByToken').mockImplementationOnce(throwError)
    const response = await _sut.load('any_token', 'any_role')
    expect(response).toBeNull()
  })

  test('Should return an account on success', async () => {
    const response = await _sut.load('any_token', 'any_role')
    expect(response?.id).toBe(_loadAccountByTokenRepositorySpy.result?.id)
  })
})
