import { Hasher } from '../../data/protocols/criptography/hasher'
import bcrypt from 'bcrypt'

export class BcryptAdapter implements Hasher {
  private readonly salt: number

  constructor (salt: number) {
    this.salt = salt
  }

  async hash (valeu: string): Promise<string> {
    return await bcrypt.hash(valeu, this.salt)
  }
}
