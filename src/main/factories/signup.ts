import { LogErrorRepository } from '../../data/protocols/log-error-repository'
import { DbAddAccount } from '../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../infra/criptagraphy/bcrypt-adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'
import { SignUpController } from '../../presentation/controllers/signup'
import { Controller } from '../../presentation/protocols'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'
import { LogControllerDecorator } from '../decorators/log'

class LogErrorRepositoryStub implements LogErrorRepository {
  async log (stack: string): Promise<void> {
    return Promise.resolve()
  }
}

export const makeSigunUpController = (): Controller => {
  const addAccountRepository = new AccountMongoRepository()
  const salt = 12
  const encrypter = new BcryptAdapter(salt)
  const addAccount = new DbAddAccount(encrypter, addAccountRepository)
  const emailValidator = new EmailValidatorAdapter()
  const signUpController = new SignUpController(emailValidator, addAccount)
  return new LogControllerDecorator(signUpController, new LogErrorRepositoryStub())
}
