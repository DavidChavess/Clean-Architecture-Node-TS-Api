import { InternalServerError } from '../errors/server'
import { HttpResponse } from '../protocols/http'

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
})

export const ok = (): HttpResponse => ({
  statusCode: 200,
  body: {}
})

export const serverError = (): HttpResponse => ({
  statusCode: 500,
  body: new InternalServerError()
})
