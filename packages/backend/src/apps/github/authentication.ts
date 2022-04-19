import type {
  IAuthentication,
  IApp,
  IField,
  IJSONObject,
} from '@automatisch/types';
import {
  getWebFlowAuthorizationUrl,
  exchangeWebFlowCode,
  checkToken,
} from '@octokit/oauth-methods';

export default class Authentication implements IAuthentication {
  appData: IApp;
  connectionData: IJSONObject;
  scopes: string[] = [
    'read:org',
    'repo',
    'user',
  ];
  client: {
    getWebFlowAuthorizationUrl: typeof getWebFlowAuthorizationUrl;
    exchangeWebFlowCode: typeof exchangeWebFlowCode;
    checkToken: typeof checkToken;
  };

  constructor(appData: IApp, connectionData: IJSONObject) {
    this.connectionData = connectionData;
    this.appData = appData;

    this.client = {
      getWebFlowAuthorizationUrl,
      exchangeWebFlowCode,
      checkToken,
    };
  }

  get oauthRedirectUrl(): string {
    return this.appData.fields.find(
      (field: IField) => field.key == 'oAuthRedirectUrl'
    ).value;
  }

  async createAuthData(): Promise<{ url: string }> {
    const { url } = await this.client.getWebFlowAuthorizationUrl({
      clientType: 'oauth-app',
      clientId: this.connectionData.consumerKey as string,
      redirectUrl: this.oauthRedirectUrl,
      scopes: this.scopes,
    });

    return {
      url: url,
    };
  }

  async verifyCredentials() {
    const { data } = await this.client.exchangeWebFlowCode({
      clientType: 'oauth-app',
      clientId: this.connectionData.consumerKey as string,
      clientSecret: this.connectionData.consumerSecret as string,
      code: this.connectionData.oauthVerifier as string,
    });

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
    return this.client.checkToken({
      clientType: 'oauth-app',
      clientId: this.connectionData.consumerKey as string,
      clientSecret: this.connectionData.consumerSecret as string,
      token: this.connectionData.accessToken as string,
    });
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
