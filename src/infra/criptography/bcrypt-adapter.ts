import { Hasher, HashComparer } from '@/data/protocols'
import bcrypt from 'bcrypt'

export class BcryptAdapter implements Hasher, HashComparer {
  constructor (private readonly salt: number) {}

  async compare (value: string, hash: string): Promise<boolean> {
    return bcrypt.compare(value, hash)
  }

  async hash (valeu: string): Promise<string> {
    return bcrypt.hash(valeu, this.salt)
  }
}
