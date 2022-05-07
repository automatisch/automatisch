import { IJSONObject } from '@automatisch/types';
import ListRepos from './data/list-repos';
import ListBranches from './data/list-branches';
import ListLabels from './data/list-labels';

export default class Data {
  listRepos: ListRepos;
  listBranches: ListBranches;
  listLabels: ListLabels;

  constructor(connectionData: IJSONObject, parameters: IJSONObject) {
    this.listRepos = new ListRepos(connectionData);
    this.listBranches = new ListBranches(connectionData, parameters);
    this.listLabels = new ListLabels(connectionData, parameters);
  }
}
