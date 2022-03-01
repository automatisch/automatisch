import type {
  IAuthentication,
  IApp,
  IField,
  IJSONObject,
} from '@automatisch/types';
import { Client } from 'pg';

export default class Authentication implements IAuthentication {
  appData: IApp;
  connectionData: IJSONObject;
  client: Client;

  constructor(appData: IApp, connectionData: IJSONObject) {
    this.client = new Client({
      host: connectionData.host as string,
      port: connectionData.port as number,
      database: connectionData.database as string,
      user: connectionData.username as string,
      password: connectionData.password as string,
      ssl: connectionData.ssl as boolean,
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
