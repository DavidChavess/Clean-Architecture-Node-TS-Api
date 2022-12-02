import { LogErrorRepository } from '../../data/protocols/db/log/log-error-repository'
import { serverError } from '../../presentation/helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log-controller-decorator'

class ControllerStub implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    return makeHttpResponse()
  }
}
class LogErrorRepositoryStub implements LogErrorRepository {
  async log (stack: string): Promise<void> {
    return Promise.resolve()
  }
}

const makeHttpRequest = (): HttpRequest => {
  return {
    body: {
      name: 'David',
      email: 'any_email@mail.com',
      password: '123',
      passwordConfirmation: '123'
    }
  }
}

const makeHttpResponse = (): HttpResponse => {
  return {
    statusCode: 201,
    body: { name: 'David' }
  }
}

const makeServerErrorWithStack = (): HttpResponse => {
  const error = new Error()
  error.stack = 'any_stack'
  return serverError(error)
}

describe('LogController Decorator', () => {
  let _controllerStub: Controller
  let _logErrorRepositoryStub: LogErrorRepository
  let _sut: LogControllerDecorator

  beforeEach(() => {
    _controllerStub = new ControllerStub()
    _logErrorRepositoryStub = new LogErrorRepositoryStub()
    _sut = new LogControllerDecorator(_controllerStub, _logErrorRepositoryStub)
  })

  test('Should call controller handle', async () => {
    const spyControllerStub = jest.spyOn(_controllerStub, 'handle')
    await _sut.handle(makeHttpRequest())
    expect(spyControllerStub).toHaveBeenCalledWith(makeHttpRequest())
  })

  test('Should return the same result of the controller', async () => {
    const httpResponse = await _sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(makeHttpResponse())
  })

  test('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
    jest.spyOn(_controllerStub, 'handle').mockResolvedValueOnce(makeServerErrorWithStack())
    const spyLogError = jest.spyOn(_logErrorRepositoryStub, 'log')
    await _sut.handle(makeHttpRequest())
    expect(spyLogError).toHaveBeenCalledWith('any_stack')
  })
})
