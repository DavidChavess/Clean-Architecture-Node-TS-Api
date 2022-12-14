import amqp, { Channel, Connection } from 'amqplib'

export const RabbitMqHelper = {
  connection: null as Connection | null,
  url: null as string | null,

  async connect (url: string): Promise<void> {
    this.url = url
    this.connection = await amqp.connect(url)
  },

  async disconnect (): Promise<void> {
    await this.connection.close()
    this.connection = null
  },

  async createChannel (): Promise<Channel> {
    if (!this.connection) {
      await this.connect(this.url)
    }
    return this.connection.createChannel()
  }
}
