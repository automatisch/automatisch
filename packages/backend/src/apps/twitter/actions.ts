import CreateTweet from './actions/create-tweet';

export default class Actions {
  createTweet: any

  constructor(connectionData: any) {
    this.createTweet = new CreateTweet(connectionData)
  }
}
