import { httpResponse } from '../protocols/https'

export const badRequest = (error: Error): httpResponse => ({
  statusCode: 400,
  body: error
})
