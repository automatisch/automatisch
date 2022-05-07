import { IJSONObject } from '@automatisch/types';
import ListProjects from './data/list-projects';

export default class Data {
  listProjects: ListProjects;

  constructor(connectionData: IJSONObject, parameters?: IJSONObject) {
    this.listProjects = new ListProjects(connectionData, parameters);
  }
}
