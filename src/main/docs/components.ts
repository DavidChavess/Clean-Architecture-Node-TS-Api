import { apiKeyAuthSchema } from './schemas/'
import { badRequestComponent, unauthorizedErrorComponent, serverErrorComponent, forbiddenErrorComponent } from './components/'

export default {
  securitySchemes: {
    apiKeyAuth: apiKeyAuthSchema
  },
  badRequest: badRequestComponent,
  unauthorized: unauthorizedErrorComponent,
  forbidden: forbiddenErrorComponent,
  serverError: serverErrorComponent
}
