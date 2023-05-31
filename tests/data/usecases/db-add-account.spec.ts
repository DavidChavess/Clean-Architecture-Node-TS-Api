import { DbAddAccount } from '@/data/usecases'
import { AddAccountRepository, LoadAccountByEmailRepository } from '@/data/protocols'
import { mockAccountModel, mockAddAccountParams } from '@/tests/domain/mocks'
import { HasherSpy, mockAddAccountRepository, mockLoadAccountByEmailRepository } from '@/tests/data/mocks'

type SutTypes = {
  sut: DbAddAccount
  hasherSpy: HasherSpy
  addAccountRepoStub: AddAccountRepository
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeSut = (): SutTypes => {
  const hasherSpy = new HasherSpy()
  const addAccountRepoStub = mockAddAccountRepository()
  const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository()
  jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockResolvedValue(null)
  const sut = new DbAddAccount(hasherSpy, addAccountRepoStub, loadAccountByEmailRepositoryStub)
  return {
    sut,
    hasherSpy,
    addAccountRepoStub,
    loadAccountByEmailRepositoryStub
  }
}

describe('DbAddAccount Usecase', () => {
  test('Should call Hasher with correct password', async () => {
    const { sut, hasherSpy } = makeSut()
    const addAccountParams = mockAddAccountParams()
    await sut.add(addAccountParams)
    expect(hasherSpy.plainText).toBe(addAccountParams.password)
  })

  test('Should throw if Hasher throws', async () => {
    const { sut, hasherSpy } = makeSut()
    jest.spyOn(hasherSpy, 'hash').mockRejectedValueOnce(new Error())
    const promise = sut.add(mockAddAccountParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepoStub } = makeSut()
    const addAccountSpy = jest.spyOn(addAccountRepoStub, 'add')
    const addAccountParams = mockAddAccountParams()
    await sut.add(addAccountParams)
    expect(addAccountSpy).toHaveBeenCalledWith({
      ...addAccountParams,
      password: 'hashed_password'
    })
  })

  test('Should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepoStub } = makeSut()
    jest.spyOn(addAccountRepoStub, 'add').mockRejectedValueOnce(new Error())
    const promise = sut.add(mockAddAccountParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should return an account on success', async () => {
    const { sut } = makeSut()
    const isValid = await sut.add(mockAddAccountParams())
    expect(isValid).toBe(true)
  })

  test('Should call loadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadAccountSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    await sut.add(mockAddAccountParams())
    expect(loadAccountSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('Should return false if LoadAccountByEmailRepository not return null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockResolvedValueOnce(mockAccountModel())
    const isValid = await sut.add(mockAddAccountParams())
    expect(isValid).toBe(false)
  })
})
