import FlickrApi from 'flickr-sdk';
import App from '../../models/app';
import Field from '../../types/field';

export default class Flickr {
  client: any
  connectionData: any
  appData: any

  constructor(connectionData: any) {
    this.client = new FlickrApi.OAuth(connectionData.consumerKey, connectionData.consumerSecret);

    this.connectionData = connectionData;
    this.appData = App.findOneByKey('flickr');
  }

  async createAuthLink() {
    const appFields = this.appData.fields.find((field: Field) => field.key == 'oAuthRedirectUrl')
    const callbackUrl = appFields.value;

    const oauthData = (await this.client.request(callbackUrl)).body;
    const url = await this.client.authorizeUrl(oauthData.oauth_token, 'delete');

    return {
      ...oauthData,
      url,
    };
  }

  async verifyCredentials() {
    const verifiedCredentials = (await this.client.verify(
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
}
