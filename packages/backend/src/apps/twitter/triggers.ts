import MyTweet from './triggers/my-tweet';
import { IJSONObject } from '@automatisch/types';

export default class Triggers {
  myTweet: MyTweet;

  constructor(connectionData: IJSONObject) {
    this.myTweet = new MyTweet(connectionData);
  }
}
