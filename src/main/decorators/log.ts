import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'

export class LogControllerDecorator implements Controller {
  private readonly constroller: Controller

  constructor (controller: Controller) {
    this.constroller = controller
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.constroller.handle(httpRequest)
    return httpResponse
  }
}
