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

  async createAuthData() {
    const appFields = this.appData.fields.find((field: Field) => field.key == 'oAuthRedirectUrl')
    const callbackUrl = appFields.value;

    const authLink = await this.client.generateAuthLink(callbackUrl);

    return {
      url: authLink.url,
      accessToken: authLink.oauth_token,
      accessSecret: authLink.oauth_token_secret,
    }
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
    try {
      await this.client.currentUser();
      return true;
    } catch {
      return false
    }
  }
}
