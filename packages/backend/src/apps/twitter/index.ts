import Authentication from './authentication';
import Triggers from './triggers';

export default class Twitter {
  authenticationClient: any
  triggers: any

  constructor(connectionData: any) {
    this.authenticationClient = new Authentication(connectionData);
    this.triggers = new Triggers(connectionData);
  }
}
