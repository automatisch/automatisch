import Authentication from './authentication';

export default class Discord {
  authenticationClient: any

  constructor(connectionData: any) {
    this.authenticationClient = new Authentication(connectionData);
  }
}
