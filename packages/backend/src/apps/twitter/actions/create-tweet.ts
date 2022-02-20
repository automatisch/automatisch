import TwitterApi from 'twitter-api-v2';

export default class CreateTweet {
  client: any;
  parameters: any;

  constructor(connectionData: any, parameters: any) {
    this.client = new TwitterApi({
      appKey: connectionData.consumerKey,
      appSecret: connectionData.consumerSecret,
      accessToken: connectionData.accessToken,
      accessSecret: connectionData.accessSecret,
    });

    if (parameters) {
      this.parameters = JSON.parse(parameters);
    }
  }

  async run() {
    const tweet = await this.client.v1.tweet(this.parameters.tweet);
    return tweet;
  }
}
