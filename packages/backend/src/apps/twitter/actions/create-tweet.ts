import TwitterClient from '../client';

export default class CreateTweet {
  client: TwitterClient;

  constructor(client: TwitterClient) {
    this.client = client;
  }

  async run() {
    const response = await this.client.createTweet.run(
      this.client.parameters.tweet as string
    );

    return response.data.data;
  }
}
