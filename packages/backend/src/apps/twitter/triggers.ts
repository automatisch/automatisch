import TwitterClient from './client';
import UserTweet from './triggers/user-tweet';
import SearchTweets from './triggers/search-tweets';

export default class Triggers {
  client: TwitterClient;
  userTweet: UserTweet;
  searchTweets: SearchTweets;

  constructor(client: TwitterClient) {
    this.client = client;
    this.userTweet = new UserTweet(client);
    this.searchTweets = new SearchTweets(client);
  }
}
