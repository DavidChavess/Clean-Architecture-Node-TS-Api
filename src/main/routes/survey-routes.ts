import { Router } from 'express'
import { adaptRoute } from '@/main/adapters'
import { makeLogControllerDecorator } from '@/main/factories/decorators'
import { makeAddSurveyController, makeLoadSurveysController } from '@/main/factories/controllers'
import { auth, authAdmin } from '@/main/middlewares'

export default (router: Router): void => {
  router.post('/surveys', authAdmin, adaptRoute(makeLogControllerDecorator(makeAddSurveyController())))
  router.get('/surveys', auth, adaptRoute(makeLogControllerDecorator(makeLoadSurveysController())))
}
