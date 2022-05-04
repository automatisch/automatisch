import { IJSONObject } from '@automatisch/types';
import ListRepos from './data/list-repos';
import ListBranches from './data/list-branches';

export default class Data {
  listRepos: ListRepos;
  listBranches: ListBranches;

  constructor(connectionData: IJSONObject, parameters: IJSONObject) {
    this.listRepos = new ListRepos(connectionData);
    this.listBranches = new ListBranches(connectionData, parameters);
  }
}
