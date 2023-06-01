import { Authentication } from '@/domain/usecases'

export const mockAuthenticationParams = (): Authentication.Params => (
  { email: 'any_email@mail.com', password: 'any_password' }
)
