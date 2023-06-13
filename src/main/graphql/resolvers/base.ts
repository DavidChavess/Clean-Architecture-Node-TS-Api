import { GraphQLScalarType, Kind } from 'graphql'

export default {
  DateTime: new GraphQLScalarType({
    name: 'DateTime',
    description: 'Data e Hora ISO-8601',
    serialize: (value: any) => new Date(value).toISOString(),
    parseValue: (value: any) => new Date(value),
    parseLiteral: (ask) => ask.kind === Kind.INT && new Date(ask.value)
  })
}
