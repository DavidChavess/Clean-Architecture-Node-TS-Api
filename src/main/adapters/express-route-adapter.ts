import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { Request, Response } from 'express'

export const adaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = { body: req.body }
    const httpResponse: HttpResponse = await controller.handle(httpRequest)

    const statusCodeStartWith = (start: string): boolean => (
      httpResponse.statusCode.toString().startsWith(start)
    )
    if (statusCodeStartWith('4') || statusCodeStartWith('5')) {
      res.status(httpResponse.statusCode).json({
        error: httpResponse.body.message
      })
    } else {
      res.status(httpResponse.statusCode).json(httpResponse.body)
    }
  }
}
