
import { LogControllerDecorator } from '@/main/decorators'
import { Controller } from '@/presentation/protocols'
import { LogMongoRepository } from '@/infra/db'

export const makeLogControllerDecorator = (controller: Controller): Controller => {
  const logErrorRepository = new LogMongoRepository()
  return new LogControllerDecorator(controller, logErrorRepository)
}
