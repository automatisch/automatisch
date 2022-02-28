import { URLSearchParams } from 'url';
import axios, { AxiosInstance } from 'axios';
import Field from '../../types/field';

export default class Authentication {
  appData: any;
  connectionData: any;
  client: AxiosInstance = axios.create({
    baseURL: 'https://discord.com/api/',
  });

  scope: string[] = ['identify', 'email'];

  constructor(appData: any, connectionData: any) {
    this.appData = appData;
    this.connectionData = connectionData;
  }

  get oauthRedirectUrl() {
    return this.appData.fields.find(
      (field: Field) => field.key == 'oAuthRedirectUrl'
    ).value;
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
    const { data: verifiedCredentials }: any = await this.client.post(
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

    const { data: user }: any = await this.client.get('/users/@me', {
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
