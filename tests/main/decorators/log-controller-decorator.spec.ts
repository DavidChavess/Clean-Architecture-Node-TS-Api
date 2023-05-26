import { LogControllerDecorator } from '@/main/decorators'
import { LogErrorRepository } from '@/data/protocols/db'
import { serverError, created } from '@/presentation/helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { mockLogErrorRepository } from '@/tests/data/mocks'

class ControllerStub implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    return makeHttpResponse()
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
  return created({ name: 'David' })
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
    _logErrorRepositoryStub = mockLogErrorRepository()
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
