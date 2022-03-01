import type {
  IAuthentication,
  IApp,
  IField,
  IJSONObject,
} from '@automatisch/types';
import TwitterApi, { TwitterApiTokens } from 'twitter-api-v2';

export default class Authentication implements IAuthentication {
  appData: IApp;
  connectionData: IJSONObject;
  client: TwitterApi;

  constructor(appData: IApp, connectionData: IJSONObject) {
    this.appData = appData;
    this.connectionData = connectionData;

    const clientParams = {
      appKey: connectionData.consumerKey,
      appSecret: connectionData.consumerSecret,
      accessToken: connectionData.accessToken,
      accessSecret: connectionData.accessSecret,
    } as TwitterApiTokens;

    this.client = new TwitterApi(clientParams);
  }

  async createAuthData() {
    const appFields = this.appData.fields.find(
      (field: IField) => field.key == 'oAuthRedirectUrl'
    );
    const callbackUrl = appFields.value;

    const authLink = await this.client.generateAuthLink(callbackUrl);

    return {
      url: authLink.url,
      accessToken: authLink.oauth_token,
      accessSecret: authLink.oauth_token_secret,
    };
  }

  async verifyCredentials() {
    const verifiedCredentials = await this.client.login(
      this.connectionData.oauthVerifier as string
    );

    return {
      consumerKey: this.connectionData.consumerKey,
      consumerSecret: this.connectionData.consumerSecret,
      accessToken: verifiedCredentials.accessToken,
      accessSecret: verifiedCredentials.accessSecret,
      userId: verifiedCredentials.userId,
      screenName: verifiedCredentials.screenName,
    };
  }

  async isStillVerified() {
    try {
      await this.client.currentUser();
      return true;
    } catch {
      return false;
    }
  }
}
