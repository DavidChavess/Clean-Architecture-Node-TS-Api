import { Decrypter, LoadAccountByTokenRepository } from '@/data/protocols'
import { LoadAccountByToken } from '@/domain/usecases'
import { AccountModel } from '@/domain/models'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) {}

  async load (accessToken: string, role?: string): Promise<AccountModel | null> {
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
