import TwitterClient from './client';
import CreateTweet from './actions/create-tweet';

export default class Actions {
  client: TwitterClient;
  createTweet: CreateTweet;

  constructor(client: TwitterClient) {
    this.client = client;
    this.createTweet = new CreateTweet(client);
  }
}
