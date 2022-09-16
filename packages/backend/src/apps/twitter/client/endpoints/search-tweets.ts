import { IJSONObject } from '@automatisch/types';
import { URLSearchParams } from 'url';
import TwitterClient from '../index';
import omitBy from 'lodash/omitBy';
import isEmpty from 'lodash/isEmpty';
import qs from 'qs';

export default class SearchTweets {
  client: TwitterClient;

  constructor(client: TwitterClient) {
    this.client = client;
  }

  async run(searchTerm: string, lastInternalId?: string) {
    const token = {
      key: this.client.connection.formattedData.accessToken as string,
      secret: this.client.connection.formattedData.accessSecret as string,
    };

    let response;
    const tweets: IJSONObject[] = [];

    do {
      const params: IJSONObject = {
        query: searchTerm,
        since_id: lastInternalId,
        pagination_token: response?.data?.meta?.next_token,
      };

      const queryParams = qs.stringify(omitBy(params, isEmpty));

      const requestPath = `/2/tweets/search/recent${
        queryParams.toString() ? `?${queryParams.toString()}` : ''
      }`;

      const requestData = {
        url: `${TwitterClient.baseUrl}${requestPath}`,
        method: 'GET',
      };

      const authHeader = this.client.oauthClient.toHeader(
        this.client.oauthClient.authorize(requestData, token)
      );

      response = await this.client.httpClient.get(requestPath, {
        headers: { ...authHeader },
      });

      console.log(response);

      if (response.data.meta.result_count > 0) {
        response.data.data.forEach((tweet: IJSONObject) => {
          if (!lastInternalId || Number(tweet.id) > Number(lastInternalId)) {
            tweets.push(tweet);
          } else {
            return;
          }
        });
      }
    } while (response.data.meta.next_token && lastInternalId);

    if (response.data?.errors) {
      const errors = response.data.errors;
      return { errors, data: tweets };
    }

    return { data: tweets };
  }
}
