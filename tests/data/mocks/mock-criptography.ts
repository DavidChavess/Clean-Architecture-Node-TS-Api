import { Hasher, Decrypter, Encrypter, HashComparer } from '@/data/protocols/criptography'

export class HasherSpy implements Hasher {
  result: string = 'hashed_password'
  plainText: string

  async hash (plainText: string): Promise<string> {
    this.plainText = plainText
    return this.result
  }
}

export class DecrypterSpy implements Decrypter {
  param: string
  result: string | null = 'any_value'

  async decrypt (value: string): Promise<string | null> {
    this.param = value
    return this.result
  }
}

export class EncrypterSpy implements Encrypter {
  param: string
  result: string = 'any_token'

  async encrypt (value: string): Promise<string> {
    this.param = value
    return this.result
  }
}

export class HashComparerSpy implements HashComparer {
  result: boolean = true
  value: string
  hash: string

  async compare (value: string, hash: string): Promise<boolean> {
    this.value = value
    this.hash = hash
    return this.result
  }
}
