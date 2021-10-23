import { google, google as GoogleApi } from 'googleapis';
import App from '../../models/app';
import Field from '../../types/field';

export default class Firebase {
  oauthClient: any
  connectionData: any
  appData: any

  scopes: string[] = [
    'https://www.googleapis.com/auth/datastore',
    'https://www.googleapis.com/auth/firebase',
    'https://www.googleapis.com/auth/user.emails.read',
    'profile',
  ]

  constructor(connectionData: any) {
    this.appData = App.findOneByKey('firebase');
    this.connectionData = connectionData;

    this.oauthClient = new GoogleApi.auth.OAuth2(
      connectionData.consumerKey,
      connectionData.consumerSecret,
      this.oauthRedirectUrl,
    );

    GoogleApi.options({ auth: this.oauthClient });
  }

  get oauthRedirectUrl() {
    return this.appData.fields.find((field: Field) => field.key == 'oAuthRedirectUrl').value;
  }

  async createAuthLink() {
    const url = this.oauthClient.generateAuthUrl({
      access_type: 'offline',
      scope: this.scopes
    });

    return { url };
  }

  async verifyCredentials() {
    const { tokens } = await this.oauthClient.getToken(this.connectionData.oauthVerifier);
    this.oauthClient.setCredentials(tokens);

    const people = GoogleApi.people('v1');

    const { data } = await people.people.get({
      resourceName: 'people/me',
      personFields: 'emailAddresses',
    });

    const { emailAddresses, resourceName: userId } = data;
    const primaryEmailAddress = emailAddresses.find(emailAddress => emailAddress.metadata.primary);

    return {
      consumerKey: this.connectionData.consumerKey,
      consumerSecret: this.connectionData.consumerSecret,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      tokenType: tokens.token_type,
      expiryDate: tokens.expiry_date,
      scope: tokens.scope,
      screenName: primaryEmailAddress.value,
      userId,
    }
  }

  async isStillVerified() {
    try {
      await this.oauthClient.getTokenInfo(this.connectionData.accessToken);
      return true;
    } catch {
      return false
    }
  }
}
