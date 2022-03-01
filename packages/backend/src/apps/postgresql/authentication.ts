import AuthenticationInterface from '../../types/interfaces/authentication-interface';
import { Client } from 'pg';
import AppInfo from '../../types/app-info';
import JSONObject from '../../types/interfaces/json-object';

export default class Authentication implements AuthenticationInterface {
  appData: AppInfo;
  connectionData: JSONObject;
  client: Client;

  constructor(appData: AppInfo, connectionData: JSONObject) {
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
