import {
  getWebFlowAuthorizationUrl,
  exchangeWebFlowCode,
  checkToken,
} from '@octokit/oauth-methods';
import App from '../../models/app';
import Field from '../../types/field';

export default class Github {
  connectionData: any
  appData: any
  scopes: string[] = ['repo']

  constructor(connectionData: any) {
    this.connectionData = connectionData;
    this.appData = App.findOneByKey('github');
  }

  get oauthRedirectUrl() {
    return this.appData.fields.find((field: Field) => field.key == 'oAuthRedirectUrl').value;
  }

  async createAuthData() {
    const { url } = await getWebFlowAuthorizationUrl({
      clientType: "oauth-app",
      clientId: this.connectionData.consumerKey,
      redirectUrl: this.oauthRedirectUrl,
      scopes: this.scopes,
    });

    return {
      url: url,
    };
  }

  async verifyCredentials() {
    const { data, authentication } = await exchangeWebFlowCode({
      clientType: "oauth-app",
      clientId: this.connectionData.consumerKey,
      clientSecret: this.connectionData.consumerSecret,
      code: this.connectionData.oauthVerifier,
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
    }
  }

  async getTokenInfo() {
    return checkToken({
      clientType: "oauth-app",
      clientId: this.connectionData.consumerKey,
      clientSecret: this.connectionData.consumerSecret,
      token: this.connectionData.accessToken,
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
