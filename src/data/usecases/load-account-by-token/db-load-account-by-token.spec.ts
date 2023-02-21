import { DbLoadAccountByToken } from './db-load-account-by-token'
import { Decrypter } from '../../protocols/criptography/decrypter'
import { AccountModel } from '../add-account/db-add-account-protocol'
import { LoadAccountByTokenRepository } from '../../protocols/db/account/load-account-by-token-repository'

const makeFakeAccountModel = (): AccountModel => ({
  id: 'valid id',
  name: 'valid name',
  email: 'valid email',
  password: 'valid password'
})

class DecrypterStub implements Decrypter {
  async decrypt (value: string): Promise<string | null> {
    return 'token_decrypted'
  }
}

class LoadAccountByTokenStub implements LoadAccountByTokenRepository {
  async loadByToken (value: string): Promise<AccountModel | null> {
    return makeFakeAccountModel()
  }
}

describe('DbLoadAccountByToken Usecase', () => {
  let _sut: DbLoadAccountByToken
  let _decrypter: DecrypterStub
  let _loadAccountByToken: LoadAccountByTokenRepository

  beforeEach(() => {
    _decrypter = new DecrypterStub()
    _loadAccountByToken = new LoadAccountByTokenStub()
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

  test('Should calls LoadAccountByTokenRepository with correct values', async () => {
    const spyLoadByToken = jest.spyOn(_loadAccountByToken, 'loadByToken')
    await _sut.load('any_token', 'any_role')
    expect(spyLoadByToken).toHaveBeenCalledWith('token_decrypted', 'any_role')
  })

  test('Should returns null if LoadAccountByTokenRepository returns null', async () => {
    jest.spyOn(_loadAccountByToken, 'loadByToken').mockResolvedValueOnce(null)
    const response = await _sut.load('any_token', 'any_role')
    expect(response).toBeNull()
  })
})
