import 'module-alias/register'
import { MongoHelper } from '@/infra/db'
import env from '@/main/config/env'

MongoHelper.connect(env.mongoUrl)
  .then(async () => {
    (await import ('./config/app')).default
      .listen(env.port, () => console.log(`server running at http://localhost:${env.port}`))
  })
  .catch(console.error)
