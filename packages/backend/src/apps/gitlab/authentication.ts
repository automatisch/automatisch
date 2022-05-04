import { URLSearchParams } from 'url';
import axios from 'axios';
import crypto from 'crypto';
import { Gitlab } from '@gitbeaker/node';
import type {
  IAuthentication,
  IApp,
  IField,
  IJSONObject,
} from '@automatisch/types';

export default class Authentication implements IAuthentication {
  appData: IApp;
  connectionData: IJSONObject;
  client: any;
  scopes = [
    'api',
    'profile',
    'email',
  ];

  constructor(appData: IApp, connectionData: IJSONObject) {
    this.connectionData = connectionData;
    this.appData = appData;

    if (connectionData?.accessToken) {
      this.client = new Gitlab({
        host: this.host,
        oauthToken: connectionData?.accessToken as string,
      });
    }
  }

  get host() {
    return `https://${this.connectionData.host}`;
  }

  get oauthRedirectUrl() {
    return this.appData.fields.find(
      (field: IField) => field.key == 'oAuthRedirectUrl'
    ).value;
  }

  async createAuthData() {
    const state = crypto.randomUUID();

    const searchParams = new URLSearchParams({
      client_id: this.connectionData.applicationId as string,
      redirect_uri: this.oauthRedirectUrl,
      response_type: 'code',
      scope: this.scopes.join(' '),
      state,
    });

    const url = `${this.host}/oauth/authorize?${searchParams.toString()}`;

    return { url };
  }

  async verifyCredentials() {
    const params = new URLSearchParams({
      client_id: this.connectionData.applicationId as string,
      grant_type: 'authorization_code',
      redirect_uri: this.oauthRedirectUrl,
      code: this.connectionData.oauthVerifier as string,
      client_secret: this.connectionData.secret as string,
    });
    const { data } = await axios.post(`${this.host}/oauth/token`, params.toString());
    const accessToken = data.access_token;

    const client = new Gitlab({
      host: this.host,
      oauthToken: accessToken,
    });

    const user = await client.Users.current();

    return {
      host: this.connectionData.host as string,
      applicationId: this.connectionData.applicationId as string,
      secret: this.connectionData.secret,
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in,
      tokenType: data.token_type,
      userId: user.id,
      screenName: user.name,
      username: user.username,
    };
  }

  async isStillVerified() {
    try {
      await this.client.Users.current();

      return true;
    } catch (err) {
      return false;
    }
  }
}
