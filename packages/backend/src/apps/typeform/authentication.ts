import type {
  IAuthentication,
  IApp,
  IField,
  IJSONObject,
} from '@automatisch/types';
import { URLSearchParams } from 'url';
import createHttpClient, { IHttpClient } from '../../helpers/http-client';

export default class Authentication implements IAuthentication {
  appData: IApp;
  connectionData: IJSONObject;
  client: IHttpClient;

  scope: string[] = [
    'forms:read',
    'forms:write',
    'webhooks:read',
    'webhooks:write',
    'responses:read',
    'accounts:read',
    'workspaces:read',
  ];

  constructor(appData: IApp, connectionData: IJSONObject) {
    this.connectionData = connectionData;
    this.appData = appData;
    this.client = createHttpClient({ baseURL: 'https://api.typeform.com' });
  }

  get oauthRedirectUrl() {
    return this.appData.fields.find(
      (field: IField) => field.key == 'oAuthRedirectUrl'
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

    const { data: verifiedCredentials } = await this.client.post(
      '/oauth/token',
      params.toString()
    );

    const {
      access_token: accessToken,
      expires_in: expiresIn,
      token_type: tokenType,
    } = verifiedCredentials;

    const { data: user } = await this.client.get('/me', {
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
