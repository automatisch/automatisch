import Authentication from './authentication';

export default class Twitch {
  authenticationClient: any

  constructor(connectionData: any) {
    this.authenticationClient = new Authentication(connectionData);
  }
}
