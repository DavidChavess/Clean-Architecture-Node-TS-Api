import { AccountModel, AddAccountModel, Encrypter, AddAccountRepository } from './db-add-account-protocol'
import { DbAddAccount } from './db-add-account'

interface SutTypes {
  sut: DbAddAccount
  encrypterStub: Encrypter
  addAccountRepoStub: AddAccountRepository
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypter (valeu: string): Promise<string> {
      return 'hashed_password'
    }
  }
  return new EncrypterStub()
}

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (accountData: AddAccountModel): Promise<AccountModel> {
      return makeFakeAddAccount()
    }
  }
  return new AddAccountRepositoryStub()
}

const makeFakeAddAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email',
  password: 'hashed_password'
})

const makeFakeAddAccountModel = (): AddAccountModel => ({
  name: 'valid_name',
  email: 'valid_email',
  password: 'valid_password'
})

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter()
  const addAccountRepoStub = makeAddAccountRepository()
  const sut = new DbAddAccount(encrypterStub, addAccountRepoStub)
  return { sut, encrypterStub, addAccountRepoStub }
}

describe('DbAddAccount Usecase', () => {
  test('Should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut()
    const encrypterSpy = jest.spyOn(encrypterStub, 'encrypter')
    await sut.add(makeFakeAddAccountModel())
    expect(encrypterSpy).toHaveBeenCalledWith('valid_password')
  })

  test('Should throw if encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypter').mockRejectedValueOnce(new Error())
    const promise = sut.add(makeFakeAddAccountModel())
    await expect(promise).rejects.toThrow()
  })

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepoStub } = makeSut()
    const addAccountSpy = jest.spyOn(addAccountRepoStub, 'add')
    await sut.add(makeFakeAddAccountModel())
    expect(addAccountSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_password'
    })
  })

  test('Should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepoStub } = makeSut()
    jest.spyOn(addAccountRepoStub, 'add').mockRejectedValueOnce(new Error())
    const promise = sut.add(makeFakeAddAccountModel())
    await expect(promise).rejects.toThrow()
  })

  test('Should return an account on success', async () => {
    const { sut } = makeSut()
    const account = await sut.add(makeFakeAddAccountModel())
    expect(account).toEqual(makeFakeAddAccount())
  })
})
