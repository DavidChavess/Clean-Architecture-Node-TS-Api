import { UpdateAccessTokenModel, UpdateAccessTokenQueue } from '../../data/protocols/queue/updateAccessTokenQueue'

export class UpdateAccessTokenRabbitMqQueue implements UpdateAccessTokenQueue {
  async send (updateAccessTokenModel: UpdateAccessTokenModel): Promise<void> {

  }
}
