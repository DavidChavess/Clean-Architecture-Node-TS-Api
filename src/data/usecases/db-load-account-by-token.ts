import { Decrypter, LoadAccountByTokenRepository } from '@/data/protocols'
import { LoadAccountByToken } from '@/domain/usecases'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) {}

  async load (accessToken: string, role?: string): Promise<LoadAccountByToken.Result | null> {
    try {
      const tokenDecrypted = await this.decrypter.decrypt(accessToken)
      if (tokenDecrypted) {
        return this.loadAccountByTokenRepository.loadByToken(accessToken, role)
      }
      return null
    } catch (error) {
      return null
    }
  }
}
