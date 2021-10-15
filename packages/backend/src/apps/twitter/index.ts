import TwitterApi from 'twitter-api-v2';
import App from '../../models/app';
import Field from '../../types/field';

export default class Twitter {
  client: any
  credentialsData: any
  appData: any

  constructor(credentialsData: any) {
    this.client = new TwitterApi({
      appKey: credentialsData.consumerKey,
      appSecret: credentialsData.consumerSecret,
      accessToken: credentialsData.accessToken,
      accessSecret: credentialsData.accessSecret
    });

    this.credentialsData = credentialsData;
    this.appData = App.findOneByName('twitter');
  }

  async createAuthLink() {
    const appFields = this.appData.fields.find((field: Field) => field.key == 'oAuthRedirectUrl')
    const callbackUrl = appFields.value;

    return this.client.generateAuthLink(callbackUrl);
  }

  async verifyCredentials() {
    const verifiedCredentials = await this.client.login(this.credentialsData.oauthVerifier)

    return {
      consumerKey: this.credentialsData.consumerKey,
      consumerSecret: this.credentialsData.consumerSecret,
      accessToken: verifiedCredentials.accessToken,
      accessSecret: verifiedCredentials.accessSecret,
      userId: verifiedCredentials.userId,
      screenName: verifiedCredentials.screenName
    }
  }
}
