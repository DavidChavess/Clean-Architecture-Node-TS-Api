import { Encrypter } from '../../data/protocols/encrypter'
import bcrypt from 'bcrypt'

export class BcryptAdapter implements Encrypter {
  private readonly salt: number

  constructor (salt: number) {
    this.salt = salt
  }

  async encrypter (valeu: string): Promise<string> {
    return await bcrypt.hash(valeu, this.salt)
  }
}
