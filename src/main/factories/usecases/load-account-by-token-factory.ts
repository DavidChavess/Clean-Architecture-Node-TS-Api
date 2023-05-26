import env from '@/main/config/env'
import { DbLoadAccountByToken } from '@/data/usecases'
import { LoadAccountByToken } from '@/domain/usecases'
import { JwtAdapter } from '@/infra/criptography'
import { AccountMongoRepository } from '@/infra/db'

export const makeLoadAccountByToken = (): LoadAccountByToken => {
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const accountRepository = new AccountMongoRepository()
  return new DbLoadAccountByToken(jwtAdapter, accountRepository)
}
