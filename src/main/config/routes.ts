import { Express, Router } from 'express'
import fg from 'fast-glob'

export default (app: Express): void => {
  const router = Router()
  const routePaths = fg.sync('**/src/main/routes/**routes.ts')
  routePaths.map(async file => (await import(`../../../${file}`)).default(router))
  app.use('/api', router)
}
