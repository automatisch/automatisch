import nodemailer from 'nodemailer';

export default class Authentication {
  appData: any;
  connectionData: any;
  client: any;

  constructor(appData: any, connectionData: any) {
    this.client = nodemailer.createTransport({
      host: connectionData.host,
      port: connectionData.port,
      secure: connectionData.useTls,
      auth: {
        user: connectionData.username,
        pass: connectionData.password,
      },
    });

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
