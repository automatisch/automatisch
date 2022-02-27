import { Client } from 'pg';

export default class Authentication {
  client: any;
  connectionData: any;
  appData: any;

  constructor(appData: any, connectionData: any) {
    this.client = new Client({
      host: connectionData.host,
      port: connectionData.port,
      database: connectionData.database,
      user: connectionData.username,
      password: connectionData.password,
      ssl: connectionData.ssl,
    });

    this.connectionData = connectionData;
    this.appData = appData;
  }

  async verifyCredentials() {
    await this.client.connect();

    return {
      screenName: this.connectionData.database,
    };
  }

  async isStillVerified() {
    try {
      await this.client.connect();
      return true;
    } catch (error) {
      return false;
    }
  }
}
