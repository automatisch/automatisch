import AuthenticationInterface from '../../types/interfaces/authentication-interface';
import FlickrApi from 'flickr-sdk';
import AppInfo from '../../types/app-info';
import Field from '../../types/field';
import JSONObject from '../../types/interfaces/json-object';

export default class Authentication implements AuthenticationInterface {
  appData: AppInfo;
  connectionData: JSONObject;
  client: typeof FlickrApi;
  oauthClient: typeof FlickrApi;

  constructor(appData: AppInfo, connectionData: JSONObject) {
    this.oauthClient = new FlickrApi.OAuth(
      connectionData.consumerKey,
      connectionData.consumerSecret
    );

    if (connectionData.accessToken && connectionData.accessSecret) {
      this.client = new FlickrApi(
        FlickrApi.OAuth.createPlugin(
          connectionData.consumerKey,
          connectionData.consumerSecret,
          connectionData.accessToken,
          connectionData.accessSecret
        )
      );
    }

    this.connectionData = connectionData;
    this.appData = appData;
  }

  async createAuthData() {
    const appFields = this.appData.fields.find(
      (field: Field) => field.key == 'oAuthRedirectUrl'
    );
    const callbackUrl = appFields.value;

    const oauthData = (await this.oauthClient.request(callbackUrl)).body;
    const url = await this.oauthClient.authorizeUrl(
      oauthData.oauth_token,
      'delete'
    );

    return {
      accessToken: oauthData.oauth_token,
      accessSecret: oauthData.oauth_token_secret,
      url: url,
    };
  }

  async verifyCredentials() {
    const verifiedCredentials = (
      await this.oauthClient.verify(
        this.connectionData.accessToken,
        this.connectionData.oauthVerifier,
        this.connectionData.accessSecret
      )
    ).body;

    return {
      consumerKey: this.connectionData.consumerKey,
      consumerSecret: this.connectionData.consumerSecret,
      accessToken: verifiedCredentials.oauth_token,
      accessSecret: verifiedCredentials.oauth_token_secret,
      userId: verifiedCredentials.user_nsid,
      screenName: verifiedCredentials.fullname,
    };
  }

  async isStillVerified() {
    try {
      await this.client.test.login();
      return true;
    } catch {
      return false;
    }
  }
}
