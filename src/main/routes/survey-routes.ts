import { Router } from 'express'
import { adaptRoute } from '../adapters/express/express-route-adapter'
import { makeLogControllerDecorator } from '../factories/decorators/log-controller-decorator-factory'
import { makeAddSurveyController } from '../factories/controllers/survey/add-survey-controller-factory'

export default (router: Router): void => {
  router.post('/surveys', adaptRoute(makeLogControllerDecorator(makeAddSurveyController())))
}
