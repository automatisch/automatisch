import CreateTweet from './actions/create-tweet';
import { IJSONObject } from '@automatisch/types';

export default class Actions {
  createTweet: CreateTweet;

  constructor(connectionData: IJSONObject, parameters: IJSONObject) {
    this.createTweet = new CreateTweet(connectionData, parameters);
  }
}
