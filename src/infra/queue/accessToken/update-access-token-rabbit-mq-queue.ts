import { UpdateAccessTokenModel, UpdateAccessTokenQueue } from '../../../data/protocols/queue/updateAccessTokenQueue'
import { RabbitMqHelper } from '../helpers/rabbit-mq-helper'

export class UpdateAccessTokenRabbitMqQueue implements UpdateAccessTokenQueue {
  private readonly queue: string = 'update-access-token-queue'

  async send (updateAccessTokenModel: UpdateAccessTokenModel): Promise<void> {
    const channel = await RabbitMqHelper.createChannel()
    await channel.assertQueue(this.queue, { durable: true })
    channel.sendToQueue(this.queue, Buffer.from(JSON.stringify(updateAccessTokenModel)))
  }
}
