import typeDefs from '@/main/graphql/typedefs'
import resolvers from '@/main/graphql/resolvers'
import plugins from '@/main/graphql/plugins'
import { authDirectiveTransformer } from '@/main/graphql/directives'
import { ApolloServer } from 'apollo-server-express'
import { Express } from 'express'
import { makeExecutableSchema } from '@graphql-tools/schema'

export default async (app: Express): Promise<void> => {
  const schema = makeExecutableSchema({ resolvers, typeDefs })

  const server = new ApolloServer({
    resolvers,
    typeDefs,
    plugins,
    context: ({ req }) => ({ req }),
    schema: authDirectiveTransformer(schema)
  })
  await server.start()
  server.applyMiddleware({ app })
}
