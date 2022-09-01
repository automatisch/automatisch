import TwitterClient from './client';
import UserTweets from './triggers/user-tweets';
import SearchTweets from './triggers/search-tweets';
import MyTweets from './triggers/my-tweets';
import MyFollowers from './triggers/my-followers';

export default class Triggers {
  client: TwitterClient;
  userTweets: UserTweets;
  searchTweets: SearchTweets;
  myTweets: MyTweets;
  myFollowers: MyFollowers;

  constructor(client: TwitterClient) {
    this.client = client;
    this.userTweets = new UserTweets(client);
    this.searchTweets = new SearchTweets(client);
    this.myTweets = new MyTweets(client);
    this.myFollowers = new MyFollowers(client);
  }
}
