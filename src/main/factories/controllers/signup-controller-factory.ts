import { SignUpController } from '@/presentation/controllers'
import { Controller } from '@/presentation/protocols'
import { makeDbAddAccount, makeDbAuthentication } from '@/main/factories/usecases'
import { makeSigunUpValidation } from '@/main/factories/controllers'

export const makeSigunUpController = (): Controller => {
  return new SignUpController(makeDbAddAccount(), makeSigunUpValidation(), makeDbAuthentication())
}
