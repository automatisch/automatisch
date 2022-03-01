import nodemailer, { Transporter, TransportOptions } from 'nodemailer';
import type {
  IAuthentication,
  IApp,
  IJSONObject,
} from '@automatisch/types';

export default class Authentication implements IAuthentication {
  appData: IApp;
  connectionData: IJSONObject;
  client: Transporter;

  constructor(appData: IApp, connectionData: IJSONObject) {
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
