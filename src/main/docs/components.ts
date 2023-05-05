import { apiKeyAuthSchema } from './schemas/'
import { badRequestComponent, unauthorizedErrorComponent, serverErrorComponent } from './components/'

export default {
  securitySchemes: {
    apiKeyAuth: apiKeyAuthSchema
  },
  badRequest: badRequestComponent,
  unauthorized: unauthorizedErrorComponent,
  serverError: serverErrorComponent
}
