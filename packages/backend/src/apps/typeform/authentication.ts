import AuthenticationInterface from '../../types/interfaces/authentication-interface';
import { URLSearchParams } from 'url';
import axios, { AxiosInstance } from 'axios';
import AppInfo from '../../types/app-info';
import Field from '../../types/field';
import JSONObject from '../../types/interfaces/json-object';

export default class Authentication implements AuthenticationInterface {
  appData: AppInfo;
  connectionData: JSONObject;
  client: AxiosInstance = axios.create({
    baseURL: 'https://api.typeform.com',
  });

  scope: string[] = [
    'forms:read',
    'forms:write',
    'webhooks:read',
    'webhooks:write',
    'responses:read',
    'accounts:read',
    'workspaces:read',
  ];

  constructor(appData: AppInfo, connectionData: JSONObject) {
    this.connectionData = connectionData;
    this.appData = appData;
  }

  get oauthRedirectUrl() {
    return this.appData.fields.find(
      (field: Field) => field.key == 'oAuthRedirectUrl'
    ).value;
  }

  async createAuthData() {
    const searchParams = new URLSearchParams({
      client_id: this.connectionData.consumerKey as string,
      redirect_uri: this.oauthRedirectUrl,
      scope: this.scope.join(' '),
    });

    const url = `https://api.typeform.com/oauth/authorize?${searchParams.toString()}`;

    return { url };
  }

  async verifyCredentials() {
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code: this.connectionData.oauthVerifier as string,
      client_id: this.connectionData.consumerKey as string,
      client_secret: this.connectionData.consumerSecret as string,
      redirect_uri: this.oauthRedirectUrl,
    });

    const { data: verifiedCredentials }: any = await this.client.post(
      '/oauth/token',
      params.toString()
    );

    const {
      access_token: accessToken,
      expires_in: expiresIn,
      token_type: tokenType,
    } = verifiedCredentials;

    const { data: user }: any = await this.client.get('/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return {
      consumerKey: this.connectionData.consumerKey,
      consumerSecret: this.connectionData.consumerSecret,
      accessToken,
      expiresIn,
      tokenType,
      userId: user.user_id,
      screenName: user.alias,
      email: user.email,
    };
  }

  async isStillVerified() {
    try {
      await this.client.get('/me', {
        headers: {
          Authorization: `Bearer ${this.connectionData.accessToken}`,
        },
      });

      return true;
    } catch {
      return false;
    }
  }
}
