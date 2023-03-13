import { SignUpController } from '@/presentation/controllers/login/signup/signup-controller'
import { Controller } from '@/presentation/protocols'
import { makeDbAddAccount } from '../../../usecases/account/add/db-add-account-factory'
import { makeDbAuthentication } from '../../../usecases/account/authentication/db-authentication-factory'
import { makeSigunUpValidation } from './signup-validation-factory'

export const makeSigunUpController = (): Controller => {
  return new SignUpController(makeDbAddAccount(), makeSigunUpValidation(), makeDbAuthentication())
}
