import TwitterClient from './client';
import UserTweets from './triggers/user-tweets';
import SearchTweets from './triggers/search-tweets';

export default class Triggers {
  client: TwitterClient;
  userTweets: UserTweets;
  searchTweets: SearchTweets;

  constructor(client: TwitterClient) {
    this.client = client;
    this.userTweets = new UserTweets(client);
    this.searchTweets = new SearchTweets(client);
  }
}
