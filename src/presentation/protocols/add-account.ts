import { HttpRequest } from './http'

export interface AddAccount {
  add: (httpRequest: HttpRequest) => void
}
