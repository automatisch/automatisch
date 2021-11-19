import TwitterApi from 'twitter-api-v2';

export default class MyTweet {
  client: any

  constructor(connectionData: any) {
    this.client = new TwitterApi({
      appKey: connectionData.consumerKey,
      appSecret: connectionData.consumerSecret,
      accessToken: connectionData.accessToken,
      accessSecret: connectionData.accessSecret
    });
  }

  async run() {
    const response = await this.client.currentUser();
    const username = response.screen_name;

    const userTimeline = await this.client.v1.userTimelineByUsername(username);
    const fetchedTweets = userTimeline.tweets;

    return fetchedTweets[0];
  }
}
