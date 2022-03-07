import TwitterApi, { TwitterApiTokens } from 'twitter-api-v2';
import { IJSONObject } from '@automatisch/types';

export default class CreateTweet {
  client: TwitterApi;
  parameters: IJSONObject;

  constructor(connectionData: IJSONObject, parameters: IJSONObject) {
    this.client = new TwitterApi({
      appKey: connectionData.consumerKey,
      appSecret: connectionData.consumerSecret,
      accessToken: connectionData.accessToken,
      accessSecret: connectionData.accessSecret,
    } as TwitterApiTokens);

    this.parameters = parameters;
  }

  async run() {
    const tweet = await this.client.v1.tweet(this.parameters.tweet as string);
    return tweet;
  }
}
