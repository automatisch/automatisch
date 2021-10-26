import FlickrApi from 'flickr-sdk';
import App from '../../models/app';
import Field from '../../types/field';

export default class Flickr {
  oauthClient: any
  client: any
  connectionData: any
  appData: any

  constructor(connectionData: any) {
    this.oauthClient = new FlickrApi.OAuth(connectionData.consumerKey, connectionData.consumerSecret);

    if (connectionData.accessToken && connectionData.accessSecret) {
      this.client = new FlickrApi(
        FlickrApi.OAuth.createPlugin(
          connectionData.consumerKey,
          connectionData.consumerSecret,
          connectionData.accessToken,
          connectionData.accessSecret,
        )
      );
    }

    this.connectionData = connectionData;
    this.appData = App.findOneByKey('flickr');
  }

  async createAuthData() {
    const appFields = this.appData.fields.find((field: Field) => field.key == 'oAuthRedirectUrl')
    const callbackUrl = appFields.value;

    const oauthData = (await this.oauthClient.request(callbackUrl)).body;
    const url = await this.oauthClient.authorizeUrl(oauthData.oauth_token, 'delete');

    return {
      accessToken: oauthData.oauth_token,
      accessSecret: oauthData.oauth_token_secret,
      url: url,
    };
  }

  async verifyCredentials() {
    const verifiedCredentials = (await this.oauthClient.verify(
      this.connectionData.accessToken,
      this.connectionData.oauthVerifier,
      this.connectionData.accessSecret
    )).body;

    return {
      consumerKey: this.connectionData.consumerKey,
      consumerSecret: this.connectionData.consumerSecret,
      accessToken: verifiedCredentials.oauth_token,
      accessSecret: verifiedCredentials.oauth_token_secret,
      userId: verifiedCredentials.user_nsid,
      screenName: verifiedCredentials.fullname
    }
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
