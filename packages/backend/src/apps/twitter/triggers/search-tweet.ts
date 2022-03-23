import TwitterApi, { TwitterApiTokens } from 'twitter-api-v2';
import { IJSONObject } from '@automatisch/types';

export default class SearchTweet {
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
    const response = await this.client.v2.get('tweets/search/recent', {
      query: this.parameters.searchTerm as string,
      max_results: 10,
    });

    return response.data;
  }
}
