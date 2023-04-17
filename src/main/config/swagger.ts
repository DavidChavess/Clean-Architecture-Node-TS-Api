import { Express } from 'express'
import { setup, serve } from 'swagger-ui-express'
import swaggerConfig from '@/main/docs'

export default (app: Express): void => {
  app.use('/api-docs', serve, setup(swaggerConfig))
}
