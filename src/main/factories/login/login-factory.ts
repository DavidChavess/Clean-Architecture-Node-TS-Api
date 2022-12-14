import env from '../../env'
import { LogControllerDecorator } from '../../decorators/log-controller-decorator'
import { LoginController } from '../../../presentation/controllers/login-controller'
import { Controller } from '../../../presentation/protocols'
import { DbAuthentication } from '../../../data/usecases/authentication/db-authentication'
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-mongo-repository'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository'
import { BcryptAdapter } from '../../../infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { JwtAdapter } from '../../../infra/criptography/jwt-adapter/jwt-adapter'
import { UpdateAccessTokenRabbitMqQueue } from '../../../infra/queue/accessToken/update-access-token-rabbit-mq-queue'
import { makeLoginValidation } from './login-factory-validation'

export const makeLoginController = (): Controller => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const accountMongoRepository = new AccountMongoRepository()
  const updateAccessTokenRabbitMqQueue = new UpdateAccessTokenRabbitMqQueue()
  const dbAuthentication = new DbAuthentication(accountMongoRepository, bcryptAdapter, jwtAdapter, updateAccessTokenRabbitMqQueue)
  const loginController = new LoginController(dbAuthentication, makeLoginValidation())
  const logErrorRepository = new LogMongoRepository()
  return new LogControllerDecorator(loginController, logErrorRepository)
}
