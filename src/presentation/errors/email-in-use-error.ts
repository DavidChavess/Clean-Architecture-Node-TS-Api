export class EmailInUseError extends Error {
  constructor () {
    super('The received email is already is use')
    this.name = 'EmailInUseError'
  }
}
