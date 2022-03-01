import nodemailer, { Transporter, TransportOptions } from 'nodemailer';
import AppInfo from '../../types/app-info';
import JSONObject from '../../types/interfaces/json-object';

export default class Authentication {
  appData: AppInfo;
  connectionData: JSONObject;
  client: Transporter;

  constructor(appData: AppInfo, connectionData: JSONObject) {
    this.client = nodemailer.createTransport({
      host: connectionData.host,
      port: connectionData.port,
      secure: connectionData.useTls,
      auth: {
        user: connectionData.username,
        pass: connectionData.password,
      },
    } as TransportOptions);

    this.connectionData = connectionData;
    this.appData = appData;
  }

  async verifyCredentials() {
    await this.client.verify();

    return {
      screenName: this.connectionData.username,
    };
  }

  async isStillVerified() {
    try {
      await this.client.verify();
      return true;
    } catch (error) {
      return false;
    }
  }
}
