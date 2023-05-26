import { LoadSurveysController } from '@/presentation/controllers'
import { Controller } from '@/presentation/protocols'
import { makeLoadSurveys } from '@/main/factories/usecases'

export const makeLoadSurveysController = (): Controller => {
  return new LoadSurveysController(makeLoadSurveys())
}
