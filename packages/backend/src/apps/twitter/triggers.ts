import { IJSONObject } from '@automatisch/types';
import MyTweet from './triggers/my-tweet';
import SearchTweet from './triggers/search-tweet';

export default class Triggers {
  myTweet: MyTweet;
  searchTweet: SearchTweet;

  constructor(connectionData: IJSONObject, parameters: IJSONObject) {
    this.myTweet = new MyTweet(connectionData);
    this.searchTweet = new SearchTweet(connectionData, parameters);
  }
}
