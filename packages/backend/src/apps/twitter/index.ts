import TwitterApi from 'twitter-api-v2';
import App from '../../models/app';
import Field from '../../types/field';

export default class Twitter {
  client: any
  appData: any

  constructor(credentialsData: any) {
    this.client = new TwitterApi({
      appKey: credentialsData.consumerKey,
      appSecret: credentialsData.consumerSecret
    });

    this.appData = App.findOneByName('twitter')
  }

  async createAuthLink() {
    const appFields = this.appData.fields.find((field: Field) => field.key == 'oAuthRedirectUrl')
    const callbackUrl = appFields.value;

    return this.client.generateAuthLink(callbackUrl);
  }
}
