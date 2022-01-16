import { URLSearchParams } from 'url';
import axios, { AxiosInstance } from 'axios';
import App from '../../models/app';
import Field from '../../types/field';

export default class Authentication {
  client?: any
  connectionData: any
  appData: any
  scope: string[] = ['identify', 'email']
  httpClient: AxiosInstance = axios.create({
    baseURL: 'https://discord.com/api/'
  })

  constructor(connectionData: any) {
    this.connectionData = connectionData;
    this.appData = App.findOneByKey('discord');
  }

  get oauthRedirectUrl() {
    return this.appData.fields.find((field: Field) => field.key == 'oAuthRedirectUrl').value;
  }

  async createAuthData() {
    const searchParams = new URLSearchParams({
      client_id: this.connectionData.consumerKey,
      redirect_uri: this.oauthRedirectUrl,
      response_type: 'code',
      scope: this.scope.join(' '),
    });

    const url = `https://discord.com/api/oauth2/authorize?${searchParams.toString()}`;

    return { url };
  }

  async verifyCredentials() {
    const params = new URLSearchParams({
      client_id: this.connectionData.consumerKey,
      redirect_uri: this.oauthRedirectUrl,
      response_type: 'code',
      scope: this.scope.join(' '),
      client_secret: this.connectionData.consumerSecret,
      code: this.connectionData.oauthVerifier,
      grant_type: 'authorization_code',
    });
    const { data: verifiedCredentials }: any = await this.httpClient.post('/oauth2/token', params.toString());

    const {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: expiresIn,
      scope: scope,
      token_type: tokenType,
    } = verifiedCredentials;

    const { data: user }: any = await this.httpClient.get('/users/@me', {
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
      await this.httpClient.get('/users/@me', {
        headers: {
          Authorization: `${this.connectionData.tokenType} ${this.connectionData.accessToken}`,
        },
      });

      return true;
    } catch {
      return false
    }
  }
}
