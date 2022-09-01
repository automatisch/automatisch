import TwitterClient from '../client';

export default class MyFollowers {
  client: TwitterClient;

  constructor(client: TwitterClient) {
    this.client = client;
  }

  async run(lastInternalId: string) {
    return this.getFollowers(lastInternalId);
  }

  async testRun() {
    return this.getFollowers();
  }

  async getFollowers(lastInternalId?: string) {
    const { username } = await this.client.getCurrentUser.run();
    const user = await this.client.getUserByUsername.run(username as string);

    const tweets = await this.client.getUserFollowers.run(
      user.id,
      lastInternalId
    );
    return tweets;
  }
}
