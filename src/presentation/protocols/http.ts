export type HttpRequest = {
  body?: any
  headers?: any
  params?: any
  accountId?: string
}

export type HttpResponse = {
  body: any
  statusCode: number
}
