export class UnauthorizedError extends Error {
  constructor () {
    super('Internal server error')
    this.name = 'UnauthorizedError'
    this.stack = 'User not authorized'
  }
}
