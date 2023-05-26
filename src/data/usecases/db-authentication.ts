import { LoadAccountByEmailRepository, HashComparer, Encrypter, UpdateAccessTokenRepository } from '@/data/protocols'
import { Authentication, AuthenticationParams } from '@/domain/usecases'
import { AuthenticationModel } from '@/domain/models'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {}

  async auth (authentication: AuthenticationParams): Promise<AuthenticationModel | null> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(authentication.email)
    if (!account) {
      return null
    }
    const isValidPassword = await this.hashComparer.compare(authentication.password, account.password)
    if (!isValidPassword) {
      return null
    }
    const accessToken = await this.encrypter.encrypt(account.id)
    await this.updateAccessTokenRepository.updateAccessToken(account.id, accessToken)
    return {
      accessToken,
      name: account.name
    }
  }
}