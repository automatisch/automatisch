import Authentication from './authentication'

export default class Flickr {
  authenticationClient: any

  constructor(connectionData: any) {
    this.authenticationClient = new Authentication(connectionData);
  }
}
