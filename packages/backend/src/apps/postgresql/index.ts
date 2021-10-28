import { Client } from 'pg';
import App from '../../models/app';

export default class PostgreSQL {
  client: any
  connectionData: any
  appData: any

  constructor(connectionData: any) {
    this.client = new Client({
      host: connectionData.host,
      port: connectionData.port,
      database: connectionData.database,
      user: connectionData.username,
      password: connectionData.password,
    })

    this.connectionData = connectionData;
    this.appData = App.findOneByKey('postgresql');
  }

  async verifyCredentials() {
    await this.client.connect()

    return {
      screenName: this.connectionData.database
    }
  }

  async isStillVerified() {
    try {
      await this.client.connect()
      return true;
    } catch(error) {
      return false
    }
  }
}
