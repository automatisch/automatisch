import AuthenticationInterface from '../../types/interfaces/authentication-interface';
import TwitterApi, { TwitterApiTokens } from 'twitter-api-v2';
import AppInfo from '../../types/app-info';
import Field from '../../types/field';
import JSONObject from '../../types/interfaces/json-object';

export default class Authentication implements AuthenticationInterface {
  appData: AppInfo;
  connectionData: JSONObject;
  client: TwitterApi;

  constructor(appData: AppInfo, connectionData: JSONObject) {
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
      (field: Field) => field.key == 'oAuthRedirectUrl'
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
