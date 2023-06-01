import { LogErrorRepository } from '@/data/protocols/db'

export class LogErrorRepositorySpy implements LogErrorRepository {
  stack: string
  async log (stack: string): Promise<void> {
    this.stack = stack
  }
}
