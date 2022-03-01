import AuthenticationInterface from '../../types/interfaces/authentication-interface';
import TwilioApi from 'twilio';
import AppInfo from '../../types/app-info';
import JSONObject from '../../types/interfaces/json-object';

export default class Authentication implements AuthenticationInterface {
  appData: AppInfo;
  connectionData: JSONObject;
  client: TwilioApi.Twilio;

  constructor(appData: AppInfo, connectionData: JSONObject) {
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
