import ListChannels from './data/list-channels';
import SlackClient from './client';

export default class Data {
  client: SlackClient;
  listChannels: ListChannels;

  constructor(client: SlackClient) {
    this.client = client;
    this.listChannels = new ListChannels(client);
  }
}
