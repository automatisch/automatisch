import TwitterApi, { TwitterApiTokens } from 'twitter-api-v2';
import { DateTime } from 'luxon';
import { AxiosInstance } from 'axios';
import { IJSONObject } from '@automatisch/types';
import createHttpClient from '../api';

export default class UserTweet {
  client: TwitterApi;
  httpClient: AxiosInstance;
  username: string;

  constructor(connectionData: IJSONObject, parameters: IJSONObject) {
    this.client = new TwitterApi({
      appKey: connectionData.consumerKey,
      appSecret: connectionData.consumerSecret,
      accessToken: connectionData.accessToken,
      accessSecret: connectionData.accessSecret,
    } as TwitterApiTokens);


    this.httpClient = createHttpClient({
      baseUrl: 'https://api.twitter.com/',
      consumer: {
        key: connectionData.consumerKey as string,
        secret: connectionData.consumerSecret as string,
      },
      token: {
        key: connectionData.accessToken as string,
        secret: connectionData.accessSecret as string,
      },
    });

    this.username = parameters.username as string;
  }

  userTweetsEndpoint(userId: string) {
    return `/2/users/${userId}/tweets`;
  }

  userByUsernameEndpoint(username: string) {
    return `/2/users/by/username/${username}`;
  }

  async getUser() {
    const endpoint = this.userByUsernameEndpoint(this.username);
    const { data } = (await this.httpClient.get(endpoint)).data;

    return data;
  }

  async getUserTweetsByApi(options: { endTime?: DateTime } = {}) {
    const { endTime } = options;
    // from UI, we get the username, but we need the userId. So we get the userId by fetching the user by username.
    // commented out to have a smooth debugging phase as this part is just working.
    // const { id: userId } = await this.getUser();
    const farukAydinUserId = '150428711';
    const endpoint = this.userTweetsEndpoint(farukAydinUserId);

    const params: Record<string, unknown> = {};

    if (endTime) {
      const endTimeDate = endTime.toISODate();
      const endTimeTime = endTime.toFormat('HH:mm:ssZZ');
      const endTimeWithoutMilliseconds = `${endTimeDate}T${endTimeTime}`;
      // `end_time` requires ISO-8601, but ISO-8601 provides milliseconds normally which twitter does not allow. Therefore, I'm using a static value that I know work for testing purposes.
      // comment `params.end_time` out to see it working.
      params.end_time = '2022-04-06T00:00:01Z';
      params.exclude = 'replies';
      params.max_results = 5;
      params['tweet.fields'] = 'attachments,author_id,created_at';
    }

    const requestConfig = { params };
    try {
      const { data: tweets } = (await this.httpClient.get(endpoint, requestConfig)).data;

      return tweets;
    }catch (err) {
      // logging response body from the Twitter API
      console.log(err.response.data);


      return [{ log: 'Check the logs in terminal to see the response body from the Twitter API' }];
    }
  }

  async getUserTweetsBySdk() {
    const params = {
      end_time: '2022-04-06T00:00:01Z',
      exclude: 'replies' as const,
      max_results: 5,
      'tweet.fields': 'attachments,author_id,created_at',
    };
    const tweets = await this.client.v2.userTimeline('150428711', params);

    return tweets.data.data;
  }

  async run(startTime: Date) {
    const startDateTime = DateTime.fromJSDate(startTime);
    return await this.getUserTweetsByApi({ endTime: startDateTime });
  }

  async testRun() {
    // mock date
    const startDateTime = DateTime.fromJSDate(new Date());
    // use the one you'd like to test
    return await this.getUserTweetsByApi({ endTime: startDateTime });
    return await this.getUserTweetsBySdk();
  }
}
