import { LogControllerDecorator } from '@/main/decorators'
import { serverError, created } from '@/presentation/helpers'
import { Controller, HttpResponse } from '@/presentation/protocols'
import { LogErrorRepositorySpy } from '@/tests/data/mocks'

class ControllerSpy implements Controller {
  request: any
  result: HttpResponse = created({ name: 'fulano' })

  async handle (request: any): Promise<HttpResponse> {
    this.request = request
    return this.result
  }
}

const mockRequest = (): any => ({
  body: {
    name: 'fulano'
  }
})

const mockServerError = (): HttpResponse => {
  const error = new Error()
  error.stack = 'any_stack'
  return serverError(error)
}

describe('LogController Decorator', () => {
  let _controllerSpy: ControllerSpy
  let _logErrorRepositorySpy: LogErrorRepositorySpy
  let _sut: LogControllerDecorator

  beforeEach(() => {
    _controllerSpy = new ControllerSpy()
    _logErrorRepositorySpy = new LogErrorRepositorySpy()
    _sut = new LogControllerDecorator(_controllerSpy, _logErrorRepositorySpy)
  })

  test('Should call controller handle', async () => {
    const request = mockRequest()
    await _sut.handle(request)
    expect(_controllerSpy.request).toBe(request)
  })

  test('Should return the same result of the controller', async () => {
    const httpResponse = await _sut.handle(mockRequest())
    expect(httpResponse).toEqual(_controllerSpy.result)
  })

  test('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
    _controllerSpy.result = mockServerError()
    await _sut.handle(mockRequest())
    expect(_logErrorRepositorySpy.stack).toBe('any_stack')
  })
})
