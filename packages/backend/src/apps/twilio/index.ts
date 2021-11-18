import Authentication from './authentication';

export default class Twilio {
  authenticationClient: any;

  constructor(connectionData: any) {
    this.authenticationClient = new Authentication(connectionData);
  }
}
