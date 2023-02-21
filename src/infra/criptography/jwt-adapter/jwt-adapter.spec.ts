import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return 'any_token'
  },

  async verify (): Promise<string> {
    return 'any_token_decrypted'
  }
}))

describe('Jwt Adapter', () => {
  let _sut: JwtAdapter

  beforeEach(() => {
    _sut = new JwtAdapter('secret')
  })

  describe('sign()', () => {
    test('Should call sign with correct values', async () => {
      const jwtSpy = jest.spyOn(jwt, 'sign')
      await _sut.encrypt('any_id')
      expect(jwtSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret')
    })

    test('Should return an token', async () => {
      const response = await _sut.encrypt('any_id')
      expect(response).toBe('any_token')
    })

    test('Should throw if sign throws', async () => {
      jest.spyOn(jwt, 'sign').mockImplementationOnce(async () => Promise.reject(new Error()))
      const promise = _sut.encrypt('any_id')
      await expect(promise).rejects.toThrow()
    })
  })

  describe('verify()', () => {
    test('Should call verify with correct values', async () => {
      const jwtSpy = jest.spyOn(jwt, 'verify')
      await _sut.decrypt('any_token')
      expect(jwtSpy).toHaveBeenCalledWith('any_token', 'secret')
    })

    test('Should return a value on veryfy success', async () => {
      const response = await _sut.decrypt('any_token')
      expect(response).toBe('any_token_decrypted')
    })
  })
})
