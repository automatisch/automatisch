import type {
  IAuthentication,
  IApp,
  IJSONObject,
} from '@automatisch/types';
import TwilioApi from 'twilio';

export default class Authentication implements IAuthentication {
  appData: IApp;
  connectionData: IJSONObject;
  client: TwilioApi.Twilio;

  constructor(appData: IApp, connectionData: IJSONObject) {
    this.client = TwilioApi(
      connectionData.accountSid as string,
      connectionData.authToken as string
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
