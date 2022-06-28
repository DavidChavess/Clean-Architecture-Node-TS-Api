export interface Encrypter {
  encrypter: (valeu: string) => Promise<string>
}
