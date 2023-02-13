import { InternalServerError, UnauthorizedError } from '../../errors'
import { HttpResponse } from '../../protocols/http'

export const ok = (body: any): HttpResponse => ({
  statusCode: 200,
  body
})

export const noContent = (): HttpResponse => ({
  statusCode: 204,
  body: null
})

export const created = (body: any): HttpResponse => ({
  statusCode: 201,
  body
})

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
})

export const unauthorized = (): HttpResponse => ({
  statusCode: 401,
  body: new UnauthorizedError()
})

export const forbidden = (error: Error): HttpResponse => ({
  statusCode: 403,
  body: error
})

export const serverError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: new InternalServerError(error.stack ?? '')
})
