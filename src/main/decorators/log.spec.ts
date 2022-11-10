import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

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
  return {
    statusCode: 201,
    body: { name: 'David' }
  }
}

describe('LogController Decorator', () => {
  let _controllerStub: Controller
  let _sut: LogControllerDecorator

  beforeEach(() => {
    _controllerStub = new ControllerStub()
    _sut = new LogControllerDecorator(_controllerStub)
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
})
