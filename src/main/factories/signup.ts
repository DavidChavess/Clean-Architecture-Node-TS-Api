import { DbAddAccount } from '../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../infra/criptagraphy/bcrypt-adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'
import { LogMongoRepository } from '../../infra/db/mongodb/log-repository/log'
import { SignUpController } from '../../presentation/controllers/signup'
import { Controller } from '../../presentation/protocols'
import { LogControllerDecorator } from '../decorators/log'
import { makeSigunUpValidation } from './signup-validation'

export const makeSigunUpController = (): Controller => {
  const addAccountRepository = new AccountMongoRepository()
  const salt = 12
  const encrypter = new BcryptAdapter(salt)
  const addAccount = new DbAddAccount(encrypter, addAccountRepository)
  const signUpController = new SignUpController(addAccount, makeSigunUpValidation())
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(signUpController, logMongoRepository)
}
