import SendMessageToChannel from './actions/send-message-to-channel';
import { IJSONObject } from '@automatisch/types';

export default class Actions {
  sendMessageToChannel: SendMessageToChannel;

  constructor(connectionData: IJSONObject, parameters: IJSONObject) {
    this.sendMessageToChannel = new SendMessageToChannel(
      connectionData,
      parameters
    );
  }
}
