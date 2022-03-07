import type {
  IAuthentication,
  IApp,
  IField,
  IJSONObject,
} from '@automatisch/types';
import { URLSearchParams } from 'url';
import axios, { AxiosInstance } from 'axios';

export default class Authentication implements IAuthentication {
  appData: IApp;
  connectionData: IJSONObject;
  client: AxiosInstance = axios.create({
    baseURL: 'https://discord.com/api/',
  });

  scope: string[] = ['identify', 'email'];

  constructor(appData: IApp, connectionData: IJSONObject) {
    this.appData = appData;
    this.connectionData = connectionData;
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
      response_type: 'code',
      scope: this.scope.join(' '),
    });

    const url = `https://discord.com/api/oauth2/authorize?${searchParams.toString()}`;

    return { url };
  }

  async verifyCredentials() {
    const params = new URLSearchParams({
      client_id: this.connectionData.consumerKey as string,
      redirect_uri: this.oauthRedirectUrl,
      response_type: 'code',
      scope: this.scope.join(' '),
      client_secret: this.connectionData.consumerSecret as string,
      code: this.connectionData.oauthVerifier as string,
      grant_type: 'authorization_code',
    });
    const { data: verifiedCredentials } = await this.client.post(
      '/oauth2/token',
      params.toString()
    );

    const {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: expiresIn,
      scope: scope,
      token_type: tokenType,
    } = verifiedCredentials;

    const { data: user } = await this.client.get('/users/@me', {
      headers: {
        Authorization: `${tokenType} ${accessToken}`,
      },
    });

    return {
      consumerKey: this.connectionData.consumerKey,
      consumerSecret: this.connectionData.consumerSecret,
      accessToken,
      refreshToken,
      expiresIn,
      scope,
      tokenType,
      userId: user.id,
      screenName: user.username,
      email: user.email,
    };
  }

  async isStillVerified() {
    try {
      await this.client.get('/users/@me', {
        headers: {
          Authorization: `${this.connectionData.tokenType} ${this.connectionData.accessToken}`,
        },
      });

      return true;
    } catch {
      return false;
    }
  }
}
