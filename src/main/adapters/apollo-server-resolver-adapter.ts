import { Controller } from '@/presentation/protocols'
import { ApolloError, AuthenticationError, ForbiddenError, UserInputError } from 'apollo-server-express'

export const adaptResolver = async (controller: Controller, args?: any): Promise<any> => {
  const request = { ...(args || {}) }
  const httpResponse = await controller.handle(request)
  switch (httpResponse.statusCode) {
    case 400: throw new UserInputError(httpResponse.body.message)
    case 401: throw new AuthenticationError(httpResponse.body.message)
    case 403: throw new ForbiddenError(httpResponse.body.message)
    case 500: throw new ApolloError(httpResponse.body.message)
    default: return httpResponse.body
  }
}
