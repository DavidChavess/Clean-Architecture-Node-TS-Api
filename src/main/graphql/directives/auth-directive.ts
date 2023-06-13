import { GraphQLSchema } from 'graphql'
import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils'
import { makeAuthMiddleware } from '@/main/factories/middlewares'
import { ForbiddenError } from 'apollo-server-express'

export const authDirectiveTransformer = (schema: GraphQLSchema): GraphQLSchema => {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const authDirective = getDirective(schema, fieldConfig, 'auth')

      if (!authDirective) {
        return fieldConfig
      }

      const { resolve } = fieldConfig

      fieldConfig.resolve = async (parent, args, context, info) => {
        const request = { accessToken: context?.req?.headers?.['x-access-token'] }
        const httpResponse = await makeAuthMiddleware().handle(request)

        if (httpResponse.statusCode === 200) {
          args = { ...args, ...(httpResponse.body || {}) }
          return resolve?.call(this, parent, args, context, info)
        }

        throw new ForbiddenError(httpResponse.body.message)
      }
    }
  })
}
