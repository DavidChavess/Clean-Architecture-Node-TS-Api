export interface Hasher {
  hash: (valeu: string) => Promise<string>
}
