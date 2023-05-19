import { apiKeyAuthSchema } from './schemas/'
import { badRequestErrorComponent, unauthorizedErrorComponent, serverErrorComponent, forbiddenErrorComponent } from './components/'

export default {
  securitySchemes: {
    apiKeyAuth: apiKeyAuthSchema
  },
  badRequestErrorComponent,
  unauthorizedErrorComponent,
  forbiddenErrorComponent,
  serverErrorComponent
}
