import Authentication from './authentication';

export default class Twitter {
  authenticationClient: any

  constructor(connectionData: any) {
    this.authenticationClient = new Authentication(connectionData);
  }
}
