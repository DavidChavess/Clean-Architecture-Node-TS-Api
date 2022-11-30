import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return 'any_token'
  }
}))

describe('Jwt Adapter', () => {
  test('Should call sign with correct values', async () => {
    const sut = new JwtAdapter('secret')
    const jwtSpy = jest.spyOn(jwt, 'sign')
    await sut.encrypt('any_id')
    expect(jwtSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret')
  })

  test('Should return an token', async () => {
    const sut = new JwtAdapter('secret')
    const response = await sut.encrypt('any_id')
    expect(response).toBe('any_token')
  })

  test('Should throw if sign throws', async () => {
    const sut = new JwtAdapter('secret')
    jest.spyOn(jwt, 'sign').mockImplementationOnce(async () => Promise.reject(new Error()))
    const promise = sut.encrypt('any_id')
    await expect(promise).rejects.toThrow()
  })
})
