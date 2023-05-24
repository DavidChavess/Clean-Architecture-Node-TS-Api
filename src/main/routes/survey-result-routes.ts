import { Router } from 'express'
import { adaptRoute } from '@/main/adapters'
import { makeLogControllerDecorator } from '@/main/factories/decorators'
import { auth } from '@/main/middlewares'
import { makeSaveSurveyResultController, makeLoadSurveyResultController } from '@/main/factories/controllers'

export default (router: Router): void => {
  router.put('/surveys/:surveyId/results', auth, adaptRoute(makeLogControllerDecorator(makeSaveSurveyResultController())))
  router.get('/surveys/:surveyId/results', auth, adaptRoute(makeLogControllerDecorator(makeLoadSurveyResultController())))
}
