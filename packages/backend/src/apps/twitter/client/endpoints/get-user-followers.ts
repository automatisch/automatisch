import { IJSONObject } from '@automatisch/types';
import { URLSearchParams } from 'url';
import TwitterClient from '../index';
import omitBy from 'lodash/omitBy';
import isEmpty from 'lodash/isEmpty';

export default class GetUserFollowers {
  client: TwitterClient;

  constructor(client: TwitterClient) {
    this.client = client;
  }

  async run(userId: string, lastInternalId?: string) {
    const token = {
      key: this.client.connection.formattedData.accessToken as string,
      secret: this.client.connection.formattedData.accessSecret as string,
    };

    let response;
    const followers: IJSONObject[] = [];

    do {
      const params: IJSONObject = {
        pagination_token: response?.data?.meta?.next_token,
      };

      const queryParams = new URLSearchParams(omitBy(params, isEmpty));

      const requestPath = `/2/users/${userId}/followers${
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

      if (response.data.meta.result_count > 0) {
        response.data.data.forEach((tweet: IJSONObject) => {
          if (!lastInternalId || Number(tweet.id) > Number(lastInternalId)) {
            followers.push(tweet);
          } else {
            return;
          }
        });
      }
    } while (response.data.meta.next_token && lastInternalId);

    if (response.data?.errors) {
      const errorMessages = response.data.errors
        .map((error: IJSONObject) => error.detail)
        .join(' ');

      throw new Error(
        `Error occured while fetching user data: ${errorMessages}`
      );
    }

    return followers;
  }
}
