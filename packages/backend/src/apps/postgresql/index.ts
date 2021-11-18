import Authentication from './authentication'

export default class PostgreSQL {
  authenticationClient: any;

  constructor(connectionData: any) {
    this.authenticationClient = new Authentication(connectionData);
  }
}
