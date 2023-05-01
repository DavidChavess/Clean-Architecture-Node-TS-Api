import { loginPaths } from './paths/login-path'
import { accessTokenSchema, errorSchema, loginParamsSchema } from './schemas'
import { badRequestComponent, unauthorizedErrorComponent, serverErrorComponent } from './components'

export default {
  openapi: '3.0.0',
  info: {
    title: 'Clean Node API',
    description: 'API para realizar enquetes entre programadores K23',
    version: '1.0.0'
  },
  servers: [{
    url: '/api'
  }],
  tags: [{
    name: 'Login'
  }],
  paths: {
    '/login': loginPaths
  },
  schemas: {
    accessToken: accessTokenSchema,
    loginParams: loginParamsSchema,
    error: errorSchema
  },
  components: {
    badRequest: badRequestComponent,
    unauthorized: unauthorizedErrorComponent,
    serverError: serverErrorComponent
  }
}
