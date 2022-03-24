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

  async run(startTime: Date) {
    const tweets = [];

    const response = await this.client.v2.search(
      this.parameters.searchTerm as string,
      {
        max_results: 50,
        'tweet.fields': 'created_at',
      }
    );

    for await (const tweet of response.data.data) {
      if (new Date(tweet.created_at).getTime() <= startTime.getTime()) {
        break;
      }

      tweets.push(tweet);

      if (response.data.meta.next_token) {
        await response.fetchNext();
      }
    }

    return tweets;
  }

  async testRun() {
    const response = await this.client.v2.search(
      this.parameters.searchTerm as string,
      {
        max_results: 10,
        'tweet.fields': 'created_at',
      }
    );

    const mostRecentTweet = response.data.data[0];

    return [mostRecentTweet];
  }
}
