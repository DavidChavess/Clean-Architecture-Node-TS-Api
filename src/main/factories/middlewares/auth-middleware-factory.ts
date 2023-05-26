import { AuthMiddleware } from '@/presentation/middlewares'
import { Middleware } from '@/presentation/protocols'
import { makeLoadAccountByToken } from '@/main/factories/usecases'

export const makeAuthMiddleware = (role?: string): Middleware => {
  return new AuthMiddleware(makeLoadAccountByToken(), role)
}
