import { DbLoadAccountByToken } from './db-load-account-by-token'
import { Decrypter } from '../../protocols/criptography/decrypter'

class DecrypterStub implements Decrypter {
  async decrypt (value: string): Promise<string | null> {
    return 'any_value'
  }
}

describe('DbLoadAccountByToken Usecase', () => {
  let _sut: DbLoadAccountByToken
  let _decrypter: DecrypterStub

  beforeEach(() => {
    _decrypter = new DecrypterStub()
    _sut = new DbLoadAccountByToken(_decrypter)
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
})
