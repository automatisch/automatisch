import TwitterClient from '../client';

export default class CreateTweet {
  client: TwitterClient;

  constructor(client: TwitterClient) {
    this.client = client;
  }

  async run() {
    const tweet = await this.client.createTweet.run(
      this.client.step.parameters.tweet as string
    );

    return tweet;
  }
}
