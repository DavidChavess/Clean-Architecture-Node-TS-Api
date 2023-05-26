import bcrypt from 'bcrypt'
import { BcryptAdapter } from '@/infra/criptography'
import { throwError } from '@/tests/domain/mocks'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return 'hash'
  },
  async compare (): Promise<boolean> {
    return true
  }
}))

const salt = 12
const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}

describe('Bcrypt Adapter', () => {
  describe('hash()', () => {
    test('Should call hash with correct values', async () => {
      const sut = makeSut()
      const bcryptSpy = jest.spyOn(bcrypt, 'hash')
      await sut.hash('any_value')
      expect(bcryptSpy).toHaveBeenCalledWith('any_value', salt)
    })

    test('Should return a valid hash on sucess', async () => {
      const sut = makeSut()
      const hash = await sut.hash('any_value')
      expect(hash).toBe('hash')
    })

    test('Should throws if hash throws', async () => {
      const sut = makeSut()
      jest.spyOn(bcrypt, 'hash').mockImplementationOnce(throwError)
      const promise = sut.hash('any_value')
      await expect(promise).rejects.toThrow()
    })
  })

  describe('compare()', () => {
    test('Should call compare with correct values', async () => {
      const sut = makeSut()
      const bcryptSpy = jest.spyOn(bcrypt, 'compare')
      await sut.compare('any_value', 'any_hash')
      expect(bcryptSpy).toHaveBeenCalledWith('any_value', 'any_hash')
    })

    test('Should return true when compare succeeds', async () => {
      const sut = makeSut()
      const response = await sut.compare('any_value', 'any_hash')
      expect(response).toBe(true)
    })

    test('Should return false when compare fails', async () => {
      const sut = makeSut()
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(async () => Promise.resolve(false))
      const response = await sut.compare('any_value', 'any_hash')
      expect(response).toBe(false)
    })

    test('Should throws if compare throws', async () => {
      const sut = makeSut()
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(throwError)
      const promise = sut.compare('any_value', 'any_hash')
      await expect(promise).rejects.toThrow()
    })
  })
})
