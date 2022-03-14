import ListChannels from './data/list-channels';
import { IJSONObject } from '@automatisch/types';

export default class Data {
  listChannels: ListChannels;

  constructor(connectionData: IJSONObject) {
    this.listChannels = new ListChannels(connectionData);
  }
}
