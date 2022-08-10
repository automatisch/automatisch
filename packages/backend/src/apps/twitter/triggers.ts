import TwitterClient from './client';
import UserTweet from './triggers/user-tweet';

export default class Triggers {
  client: TwitterClient;
  userTweet: UserTweet;

  constructor(client: TwitterClient) {
    this.client = client;
    this.userTweet = new UserTweet(client);
  }
}
