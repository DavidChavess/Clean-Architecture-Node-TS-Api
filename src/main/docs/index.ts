import { loginPaths, surveyResultPaths } from './paths'
import { accessTokenModelSchema, errorModelSchema, loginParamsSchema, surveyResultModelSchema, surveyResultParamsSchema } from './schemas'
import { badRequestComponent, unauthorizedErrorComponent, serverErrorComponent } from './components'

export default {
  openapi: '3.0.0',
  info: {
    title: 'Clean Node API',
    description: 'API para realizar enquetes entre programadores',
    version: '1.0.0'
  },
  servers: [{
    url: '/api'
  }],
  tags: [{
    name: 'Login'
  }],
  paths: {
    '/login': loginPaths,
    '/surveys/{id}/results': surveyResultPaths
  },
  schemas: {
    accessToken: accessTokenModelSchema,
    loginParams: loginParamsSchema,
    error: errorModelSchema,
    surveyResultParamsSchema: surveyResultParamsSchema,
    surveyResultModelSchema: surveyResultModelSchema
  },
  components: {
    badRequest: badRequestComponent,
    unauthorized: unauthorizedErrorComponent,
    serverError: serverErrorComponent
  }
}
