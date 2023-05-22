import { mockAccountModel } from '@/domain/test'
import { DbLoadAccountByToken } from './db-load-account-by-token'
import { Decrypter, LoadAccountByTokenRepository } from './db-load-account-by-token-protocols'
import { mockDecrypter, mockLoadAccountByTokenRepository } from '@/data/test'

describe('DbLoadAccountByToken Usecase', () => {
  let _sut: DbLoadAccountByToken
  let _decrypter: Decrypter
  let _loadAccountByToken: LoadAccountByTokenRepository

  beforeEach(() => {
    _decrypter = mockDecrypter()
    _loadAccountByToken = mockLoadAccountByTokenRepository()
    _sut = new DbLoadAccountByToken(_decrypter, _loadAccountByToken)
  })

  test('Should call Decrypter with correct value', async () => {
    const spyOn = jest.spyOn(_decrypter, 'decrypt')
    await _sut.load('any_token', 'any_role')
    expect(spyOn).toHaveBeenCalledWith('any_token')
  })

  test('Should returns null if Decrypter returns null', async () => {
    jest.spyOn(_decrypter, 'decrypt').mockResolvedValueOnce(null)
    const response = await _sut.load('any_token', 'any_role')
    expect(response).toBeNull()
  })

  test('Should returns null if Decrypter throws', async () => {
    jest.spyOn(_decrypter, 'decrypt').mockRejectedValueOnce(new Error('any_error'))
    const token = await _sut.load('any_token', 'any_role')
    expect(token).toBeNull()
  })

  test('Should calls LoadAccountByTokenRepository with correct values', async () => {
    const spyLoadByToken = jest.spyOn(_loadAccountByToken, 'loadByToken')
    await _sut.load('any_token', 'any_role')
    expect(spyLoadByToken).toHaveBeenCalledWith('any_token', 'any_role')
  })

  test('Should returns null if LoadAccountByTokenRepository returns null', async () => {
    jest.spyOn(_loadAccountByToken, 'loadByToken').mockResolvedValueOnce(null)
    const response = await _sut.load('any_token', 'any_role')
    expect(response).toBeNull()
  })

  test('Should throws if LoadAccountByTokenRepository throws', async () => {
    jest.spyOn(_loadAccountByToken, 'loadByToken').mockRejectedValueOnce(new Error('any_error'))
    const promise = _sut.load('any_token', 'any_role')
    await expect(promise).rejects.toThrow(new Error('any_error'))
  })

  test('Should return an account on success', async () => {
    const response = await _sut.load('any_token', 'any_role')
    expect(response).toEqual(mockAccountModel())
  })
})
