import { Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeLogControllerDecorator } from '../factories/decorators/log-controller-decorator-factory'
import { makeAddSurveyController } from '../factories/controllers/survey/add-survey-controller-factory'
import { makeAuthMiddleware } from '../factories/middlewares/auth-middleware-factory'
import { adaptMiddleware } from '../adapters/express-middleware-adapter'

export default (router: Router): void => {
  const authAdmin = makeAuthMiddleware('admin')
  router.post('/surveys', adaptMiddleware(authAdmin), adaptRoute(makeLogControllerDecorator(makeAddSurveyController())))
}
