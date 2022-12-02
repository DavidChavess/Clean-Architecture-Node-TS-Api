import { Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeSigunUpController } from '../factories/signup/signup-factory'

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSigunUpController()))
}
