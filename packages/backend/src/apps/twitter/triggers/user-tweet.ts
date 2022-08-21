import TwitterClient from '../client';

export default class UserTweet {
  client: TwitterClient;

  constructor(client: TwitterClient) {
    this.client = client;
  }

  async run() {
    return this.getTweets();
  }

  async testRun() {
    return this.getTweets();
  }

  async getTweets() {
    const userResponse = await this.client.getUserByUsername.run(
      this.client.step.parameters.username as string
    );

    const userId = userResponse.data.data.id;

    const tweetsResponse = await this.client.getUserTweets.run(userId);
    const tweets = tweetsResponse.data.data;

    return tweets;
  }
}
