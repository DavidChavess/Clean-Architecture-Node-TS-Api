import { Router } from 'express'
import { adaptRoute } from '@/main/adapters/express-route-adapter'
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'
import { auth } from '@/main/middlewares/auth'
import { makeSaveSurveyResultController } from '@/main/factories/controllers/survey-result/save-survey-result-controller-factory'

export default (router: Router): void => {
  router.put('/surveys/:surveyId/results', auth, adaptRoute(makeLogControllerDecorator(makeSaveSurveyResultController())))
}
