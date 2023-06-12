import { adaptResolver } from '@/main/adapters/apollo-server-resolver-adapter'
import { makeLoginController, makeSigunUpController } from '@/main/factories/controllers'

export default {
  Query: {
    login: async (parent: any, args: any) => adaptResolver(makeLoginController(), args)
  },

  Mutation: {
    signUp: async (parent: any, args: any) => adaptResolver(makeSigunUpController(), args)
  }
}
