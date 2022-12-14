import { RabbitMqHelper } from '../infra/queue/helpers/rabbit-mq-helper'
import { MongoHelper } from '../infra/db/mongodb/helpers/mongo-helper'
import env from './env'

MongoHelper.connect(env.mongoUrl)
  .then(async () => {
    RabbitMqHelper.connect(env.rabbitMqUrl)
      .then(async () => {
        (await import ('./config/app')).default
          .listen(env.port, () => console.log(`server running at http://localhost:${env.port}`))
      })
      .catch(console.error)
  })
  .catch(console.error)
