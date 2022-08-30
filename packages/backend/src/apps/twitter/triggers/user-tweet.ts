import TwitterClient from '../client';

export default class UserTweet {
  client: TwitterClient;

  constructor(client: TwitterClient) {
    this.client = client;
  }

  async run(lastInternalId: string) {
    return this.getTweets(lastInternalId);
  }

  async testRun() {
    return this.getTweets();
  }

  async getTweets(lastInternalId?: string) {
    const user = await this.client.getUserByUsername.run(
      this.client.step.parameters.username as string
    );

    const tweets = await this.client.getUserTweets.run(user.id, lastInternalId);

    return tweets;
  }
}
