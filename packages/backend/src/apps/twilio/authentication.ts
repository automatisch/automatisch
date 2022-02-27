import TwilioApi from 'twilio';

export default class Authentication {
  client: any;
  connectionData: any;
  appData: any;

  constructor(appData: any, connectionData: any) {
    this.client = TwilioApi(
      connectionData.accountSid,
      connectionData.authToken
    );

    this.connectionData = connectionData;
    this.appData = appData;
  }

  async verifyCredentials() {
    await this.verify();

    return {
      screenName: this.connectionData.accountSid,
    };
  }

  async verify() {
    try {
      await this.client.keys.list({ limit: 1 });
      return true;
    } catch (error) {
      // Test credentials throw HTTP 403 and thus, we need to have an exception.
      return error?.status === 403;
    }
  }

  async isStillVerified() {
    return this.verify();
  }
}
