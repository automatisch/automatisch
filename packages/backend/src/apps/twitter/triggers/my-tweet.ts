import TwitterApi, { TwitterApiTokens } from 'twitter-api-v2';
import { IJSONObject } from '@automatisch/types';

export default class MyTweet {
  client: TwitterApi;

  constructor(connectionData: IJSONObject) {
    this.client = new TwitterApi({
      appKey: connectionData.consumerKey,
      appSecret: connectionData.consumerSecret,
      accessToken: connectionData.accessToken,
      accessSecret: connectionData.accessSecret,
    } as TwitterApiTokens);
  }

  async run() {
    const response = await this.client.currentUser();
    const username = response.screen_name;

    const userTimeline = await this.client.v1.userTimelineByUsername(username);
    const fetchedTweets = userTimeline.tweets;

    return fetchedTweets[0];
  }
}
