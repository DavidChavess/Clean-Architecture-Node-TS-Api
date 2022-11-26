import { AccountModel, AddAccountModel, Hasher, AddAccountRepository } from './db-add-account-protocol'
import { DbAddAccount } from './db-add-account'

interface SutTypes {
  sut: DbAddAccount
  hasherStub: Hasher
  addAccountRepoStub: AddAccountRepository
}

const makeHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash (valeu: string): Promise<string> {
      return 'hashed_password'
    }
  }
  return new HasherStub()
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
  const hasherStub = makeHasher()
  const addAccountRepoStub = makeAddAccountRepository()
  const sut = new DbAddAccount(hasherStub, addAccountRepoStub)
  return { sut, hasherStub, addAccountRepoStub }
}

describe('DbAddAccount Usecase', () => {
  test('Should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut()
    const hasherSpy = jest.spyOn(hasherStub, 'hash')
    await sut.add(makeFakeAddAccountModel())
    expect(hasherSpy).toHaveBeenCalledWith('valid_password')
  })

  test('Should throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'hash').mockRejectedValueOnce(new Error())
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
