import { Hasher } from '@/data/protocols/criptography/hasher'
import { HashComparer } from '@/data/protocols/criptography/hash-comparer'
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
