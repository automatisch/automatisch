import type {
  IAuthentication,
  IApp,
  IField,
  IJSONObject,
} from '@automatisch/types';
import HttpClient from '../../helpers/http-client';
import OAuth from 'oauth-1.0a';
import crypto from 'crypto';
import { URLSearchParams } from 'url';

export default class Authentication implements IAuthentication {
  appData: IApp;
  connectionData: IJSONObject;

  client: HttpClient;
  oauthClient: OAuth;

  static baseUrl = 'https://api.twitter.com';

  constructor(appData: IApp, connectionData: IJSONObject) {
    this.appData = appData;
    this.connectionData = connectionData;
    this.client = new HttpClient({ baseURL: Authentication.baseUrl });
    this.oauthClient = new OAuth({
      consumer: {
        key: this.connectionData.consumerKey as string,
        secret: this.connectionData.consumerSecret as string,
      },
      signature_method: 'HMAC-SHA1',
      hash_function(base_string, key) {
        return crypto
          .createHmac('sha1', key)
          .update(base_string)
          .digest('base64');
      },
    });
  }

  async createAuthData() {
    const appFields = this.appData.fields.find(
      (field: IField) => field.key == 'oAuthRedirectUrl'
    );
    const callbackUrl = appFields.value;

    const requestData = {
      url: `${Authentication.baseUrl}/oauth/request_token`,
      method: 'POST',
      data: { oauth_callback: callbackUrl },
    };

    const authHeader = this.oauthClient.toHeader(
      this.oauthClient.authorize(requestData)
    );

    try {
      const response = await this.client.post(`/oauth/request_token`, null, {
        headers: { ...authHeader },
      });

      const responseData = Object.fromEntries(
        new URLSearchParams(response.data)
      );

      return {
        url: `${Authentication.baseUrl}/oauth/authorize?oauth_token=${responseData.oauth_token}`,
        accessToken: responseData.oauth_token,
        accessSecret: responseData.oauth_token_secret,
      };
    } catch (error) {
      const errorMessages = error.response.data.errors
        .map((error: IJSONObject) => error.message)
        .join(' ');

      throw new Error(
        `Error occured while verifying credentials: ${errorMessages}`
      );
    }
  }

  async verifyCredentials() {
    const verifiedCredentials = await this.client.post(
      `/oauth/access_token?oauth_verifier=${this.connectionData.oauthVerifier}&oauth_token=${this.connectionData.accessToken}`,
      null
    );

    const responseData = Object.fromEntries(
      new URLSearchParams(verifiedCredentials.data)
    );

    return {
      consumerKey: this.connectionData.consumerKey,
      consumerSecret: this.connectionData.consumerSecret,
      accessToken: responseData.oauth_token,
      accessSecret: responseData.oauth_token_secret,
      userId: responseData.user_id,
      screenName: responseData.screen_name,
    };
  }

  async isStillVerified() {
    try {
      const token = {
        key: this.connectionData.accessToken as string,
        secret: this.connectionData.accessSecret as string,
      };

      const requestData = {
        url: `${Authentication.baseUrl}/1.1/account/verify_credentials.json`,
        method: 'GET',
      };

      const authHeader = this.oauthClient.toHeader(
        this.oauthClient.authorize(requestData, token)
      );

      await this.client.get(`/1.1/account/verify_credentials.json`, {
        headers: { ...authHeader },
      });

      return true;
    } catch (error) {
      return false;
    }
  }
}
