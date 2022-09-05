import type { IAuthentication, IField } from '@automatisch/types';
import { URLSearchParams } from 'url';
import TwitterClient from './client';

export default class Authentication implements IAuthentication {
  client: TwitterClient;

  constructor(client: TwitterClient) {
    this.client = client;
  }

  async createAuthData() {
    const appFields = this.client.connection.appData.fields.find(
      (field: IField) => field.key == 'oAuthRedirectUrl'
    );
    const callbackUrl = appFields.value;

    const response = await this.client.oauthRequestToken.run(callbackUrl);
    const responseData = Object.fromEntries(new URLSearchParams(response.data));

    return {
      url: `${TwitterClient.baseUrl}/oauth/authorize?oauth_token=${responseData.oauth_token}`,
      accessToken: responseData.oauth_token,
      accessSecret: responseData.oauth_token_secret,
    };
  }

  async verifyCredentials() {
    const response = await this.client.verifyAccessToken.run();
    const responseData = Object.fromEntries(new URLSearchParams(response.data));

    return {
      consumerKey: this.client.connection.formattedData.consumerKey as string,
      consumerSecret: this.client.connection.formattedData
        .consumerSecret as string,
      accessToken: responseData.oauth_token,
      accessSecret: responseData.oauth_token_secret,
      userId: responseData.user_id,
      screenName: responseData.screen_name,
    };
  }

  async isStillVerified() {
    try {
      await this.client.getCurrentUser.run();
      return true;
    } catch (error) {
      return false;
    }
  }
}
