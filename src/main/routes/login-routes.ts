import { Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeSigunUpController } from '../factories/controllers/login/signup/signup-controller-factory'
import { makeLoginController } from '../factories/controllers/login/login/login-controller-factory'
import { makeLogControllerDecorator } from '../factories/decorators/log-controller-decorator-factory'

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeLogControllerDecorator(makeSigunUpController())))
  router.post('/login', adaptRoute(makeLogControllerDecorator(makeLoginController())))
}
