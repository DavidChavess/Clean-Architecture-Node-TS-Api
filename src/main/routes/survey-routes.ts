import { Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeLogControllerDecorator } from '../factories/decorators/log-controller-decorator-factory'
import { makeAddSurveyController } from '../factories/controllers/survey/add/add-survey-controller-factory'
import { makeAuthMiddleware } from '../factories/middlewares/auth-middleware-factory'
import { adaptMiddleware } from '../adapters/express-middleware-adapter'
import { makeLoadSurveysController } from '../factories/controllers/survey/load/load-surveys-controller-factory'

export default (router: Router): void => {
  const authAdmin = makeAuthMiddleware('admin')
  const auth = makeAuthMiddleware()
  router.post('/surveys', adaptMiddleware(authAdmin), adaptRoute(makeLogControllerDecorator(makeAddSurveyController())))
  router.get('/surveys', adaptMiddleware(auth), adaptRoute(makeLogControllerDecorator(makeLoadSurveysController())))
}
