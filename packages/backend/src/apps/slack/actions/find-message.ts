import SlackClient from '../client';

export default class FindMessage {
  client: SlackClient;

  constructor(client: SlackClient) {
    this.client = client;
  }

  async run() {
    const parameters = this.client.step.parameters;
    const query = parameters.query as string;
    const sortBy = parameters.sortBy as string;
    const sortDirection = parameters.sortDirection as string;
    const count = 1;

    const messages = await this.client.findMessages.run(
      query,
      sortBy,
      sortDirection,
      count,
    );

    return messages;
  }
}
