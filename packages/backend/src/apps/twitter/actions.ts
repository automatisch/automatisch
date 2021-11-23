import CreateTweet from './actions/create-tweet';

export default class Actions {
  createTweet: any

  constructor(connectionData: any, parameters: any) {
    this.createTweet = new CreateTweet(connectionData, parameters)
  }
}
