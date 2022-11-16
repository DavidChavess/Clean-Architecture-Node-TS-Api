import { InternalServerError, UnauthorizedError } from '../errors'
import { HttpResponse } from '../protocols/http'

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
})

export const created = (body: any): HttpResponse => ({
  statusCode: 201,
  body
})

export const serverError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: new InternalServerError(error.stack ?? '')
})

export const unauthorized = (): HttpResponse => ({
  statusCode: 401,
  body: new UnauthorizedError()
})
