import Authentication from './authentication';

export default class Typeform {
  authenticationClient: any;

  constructor(connectionData: any) {
    this.authenticationClient = new Authentication(connectionData);
  }
}
