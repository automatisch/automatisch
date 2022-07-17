import type {
  IAuthentication,
  IApp,
  IField,
  IJSONObject,
} from '@automatisch/types';
import HttpClient from '../../helpers/http-client';
import { URLSearchParams } from 'url';

export default class Authentication implements IAuthentication {
  appData: IApp;
  connectionData: IJSONObject;
  scopes: string[] = ['read:org', 'repo', 'user'];
  client: HttpClient;

  constructor(appData: IApp, connectionData: IJSONObject) {
    this.connectionData = connectionData;
    this.appData = appData;
    this.client = new HttpClient({ baseURL: 'https://github.com' });
  }

  get oauthRedirectUrl(): string {
    return this.appData.fields.find(
      (field: IField) => field.key == 'oAuthRedirectUrl'
    ).value;
  }

  async createAuthData(): Promise<{ url: string }> {
    const searchParams = new URLSearchParams({
      client_id: this.connectionData.consumerKey as string,
      redirect_uri: this.oauthRedirectUrl,
      scope: this.scopes.join(','),
    });

    const url = `https://github.com/login/oauth/authorize?${searchParams.toString()}`;

    return {
      url,
    };
  }

  async verifyCredentials() {
    const response = await this.client.post('/login/oauth/access_token', {
      client_id: this.connectionData.consumerKey,
      client_secret: this.connectionData.consumerSecret,
      code: this.connectionData.oauthVerifier,
    });

    const data = Object.fromEntries(new URLSearchParams(response.data));

    this.connectionData.accessToken = data.access_token;

    const tokenInfo = await this.getTokenInfo();

    return {
      consumerKey: this.connectionData.consumerKey,
      consumerSecret: this.connectionData.consumerSecret,
      accessToken: data.access_token,
      scope: data.scope,
      tokenType: data.token_type,
      userId: tokenInfo.data.user.id,
      screenName: tokenInfo.data.user.login,
    };
  }

  async getTokenInfo() {
    const basicAuthToken = Buffer.from(
      this.connectionData.consumerKey + ':' + this.connectionData.consumerSecret
    ).toString('base64');

    const headers = {
      Authorization: `Basic ${basicAuthToken}`,
    };

    const body = {
      access_token: this.connectionData.accessToken,
    };

    return await this.client.post(
      `https://api.github.com/applications/${this.connectionData.consumerKey}/token`,
      body,
      { headers }
    );
  }

  async isStillVerified() {
    try {
      await this.getTokenInfo();

      return true;
    } catch {
      return false;
    }
  }
}
