import { IJSONObject } from '@automatisch/types';
import ListAlbums from './data/list-albums';

export default class Data {
  listAlbums: ListAlbums;

  constructor(connectionData: IJSONObject) {
    this.listAlbums = new ListAlbums(connectionData);
  }
}
