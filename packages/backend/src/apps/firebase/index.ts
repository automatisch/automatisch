import Authentication from './authentication'

export default class Firebase {
  authenticationClient: any

  constructor(connectionData: any) {
    this.authenticationClient = new Authentication(connectionData);
  }
}
