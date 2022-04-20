import { IJSONObject } from '@automatisch/types';
import ListRepos from './data/list-repos';

export default class Data {
  listRepos: ListRepos;

  constructor(connectionData: IJSONObject) {
    this.listRepos = new ListRepos(connectionData);
  }
}
