import { DbLoadAccountByToken } from './db-load-account-by-token'
import { Decrypter } from '../../protocols/criptography/decrypter'

class DecrypterStub implements Decrypter {
  async decrypt (value: string): Promise<string> {
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
    await _sut.load('any_token')
    expect(spyOn).toHaveBeenCalledWith('any_token')
  })
})
