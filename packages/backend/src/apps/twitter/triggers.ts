import MyTweet from './triggers/my-tweet';

export default class Triggers {
  myTweet: any

  constructor(connectionData: any) {
    this.myTweet = new MyTweet(connectionData)
  }
}
