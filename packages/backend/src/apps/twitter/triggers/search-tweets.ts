import TwitterClient from '../client';

export default class SearchTweets {
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
    const tweets = await this.client.searchTweets.run(
      this.client.step.parameters.searchTerm as string,
      lastInternalId
    );

    return tweets;
  }
}
