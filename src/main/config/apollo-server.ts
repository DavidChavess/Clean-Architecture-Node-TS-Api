import typeDefs from '@/main/graphql/typedefs'
import resolvers from '@/main/graphql/resolvers'

import { ApolloServer } from 'apollo-server-express'
import { PluginDefinition } from 'apollo-server-core'
import { GraphQLResponse } from 'apollo-server-types'
import { Express } from 'express'
import { GraphQLError } from 'graphql'

const handleError = (response: GraphQLResponse, errors: readonly GraphQLError[], errorName: string, httpStatus: number): void => {
  const errorNames = errors.map(error => error.originalError?.name ?? error.name)
  if (errorNames.includes(errorName)) {
    response.data = undefined
    if (response.http) {
      response.http.status = httpStatus
    }
  }
}

const handleErrorPlugin: PluginDefinition = {
  requestDidStart: async (method) => ({
    willSendResponse: async ({ response, errors }) => {
      if (errors) {
        handleError(response, errors, 'UserInputError', 400)
        handleError(response, errors, 'AuthenticationError', 401)
        handleError(response, errors, 'ForbiddenError', 403)
        handleError(response, errors, 'ApolloError', 500)
      }
    }
  })
}

const plugins: PluginDefinition[] = [handleErrorPlugin]

export default async (app: Express): Promise<void> => {
  const server = new ApolloServer({
    resolvers,
    typeDefs,
    plugins
  })
  await server.start()
  server.applyMiddleware({ app })
}
