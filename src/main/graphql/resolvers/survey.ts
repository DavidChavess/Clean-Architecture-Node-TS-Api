import { adaptResolver } from '@/main/adapters/apollo-server-resolver-adapter'
import { makeLoadSurveysController, makeLoginController, makeSigunUpController } from '@/main/factories/controllers'

export default {
  Query: {
    surveys: async () => adaptResolver(makeLoadSurveysController())
  }
}
