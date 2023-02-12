import { SignUpController } from '../../../../../presentation/controllers/login/signup/signup-controller'
import { Controller } from '../../../../../presentation/protocols'
import { makeDbAddAccount } from '../../../usecases/add-account/db-add-account-factory'
import { makeDbAuthentication } from '../../../usecases/authentication/db-authentication-factory'
import { makeSigunUpValidation } from './signup-validation-factory'

export const makeSigunUpController = (): Controller => {
  return new SignUpController(makeDbAddAccount(), makeSigunUpValidation(), makeDbAuthentication())
}
