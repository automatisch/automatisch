import TwitterApi from 'twitter-api-v2';
import App from '../../models/app';
import Field from '../../types/field';

export default class Twitter {
  client: any
  connectionData: any
  appData: any

  constructor(connectionData: any) {
    this.client = new TwitterApi({
      appKey: connectionData.consumerKey,
      appSecret: connectionData.consumerSecret,
      accessToken: connectionData.accessToken,
      accessSecret: connectionData.accessSecret
    });

    this.connectionData = connectionData;
    this.appData = App.findOneByKey('twitter');
  }

  async createAuthLink() {
    const appFields = this.appData.fields.find((field: Field) => field.key == 'oAuthRedirectUrl')
    const callbackUrl = appFields.value;

    return this.client.generateAuthLink(callbackUrl);
  }

  async verifyCredentials() {
    const verifiedCredentials = await this.client.login(this.connectionData.oauthVerifier)

    return {
      consumerKey: this.connectionData.consumerKey,
      consumerSecret: this.connectionData.consumerSecret,
      accessToken: verifiedCredentials.accessToken,
      accessSecret: verifiedCredentials.accessSecret,
      userId: verifiedCredentials.userId,
      screenName: verifiedCredentials.screenName
    }
  }

  async isStillVerified() {
    const userData = await this.client.currentUser();
    return userData.id ? true : false
  }
}
