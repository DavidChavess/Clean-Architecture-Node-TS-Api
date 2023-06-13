import { PluginDefinition } from 'apollo-server-core'
import { GraphQLResponse } from 'apollo-server-types'
import { GraphQLError } from 'graphql'

function handleError (response: GraphQLResponse, errors: readonly GraphQLError[], errorName: string, httpStatus: number): void {
  const errorNames = errors.map(error => error.originalError?.name ?? error.name)
  if (errorNames.includes(errorName)) {
    response.data = undefined
    if (response.http) {
      response.http.status = httpStatus
    }
  }
}

export const handleErrorPlugin: PluginDefinition = {
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
