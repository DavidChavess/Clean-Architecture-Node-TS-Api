export interface LogErrorRepository {
  log: (account: string) => Promise<void>
}
