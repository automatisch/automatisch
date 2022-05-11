import { IJSONObject } from '@automatisch/types';
import NewMessageToChannel from './triggers/new-message-to-channel';

export default class Triggers {
  newMessageToChannel: NewMessageToChannel;

  constructor(connectionData: IJSONObject, parameters: IJSONObject) {
    this.newMessageToChannel = new NewMessageToChannel(
      connectionData,
      parameters
    );
  }
}
