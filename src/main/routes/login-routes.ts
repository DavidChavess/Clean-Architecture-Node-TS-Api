import { Router } from 'express'
import { adaptRoute } from '@/main/adapters'
import { makeSigunUpController, makeLoginController } from '@/main/factories/controllers'
import { makeLogControllerDecorator } from '@/main/factories/decorators'

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeLogControllerDecorator(makeSigunUpController())))
  router.post('/login', adaptRoute(makeLogControllerDecorator(makeLoginController())))
}
