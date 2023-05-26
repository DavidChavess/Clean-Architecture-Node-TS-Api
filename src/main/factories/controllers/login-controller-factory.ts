import { LoginController } from '@/presentation/controllers'
import { Controller } from '@/presentation/protocols'
import { makeDbAuthentication } from '@/main/factories/usecases'
import { makeLoginValidation } from '@/main/factories/controllers'

export const makeLoginController = (): Controller => {
  return new LoginController(makeDbAuthentication(), makeLoginValidation())
}
