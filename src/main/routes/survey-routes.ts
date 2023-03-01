import { Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeLogControllerDecorator } from '../factories/decorators/log-controller-decorator-factory'
import { makeAddSurveyController } from '../factories/controllers/survey/add/add-survey-controller-factory'
import { makeLoadSurveysController } from '../factories/controllers/survey/load/load-surveys-controller-factory'
import { authAdmin } from '../middlewares/auth-admin'
import { auth } from '../middlewares/auth'

export default (router: Router): void => {
  router.post('/surveys', authAdmin, adaptRoute(makeLogControllerDecorator(makeAddSurveyController())))
  router.get('/surveys', auth, adaptRoute(makeLogControllerDecorator(makeLoadSurveysController())))
}
