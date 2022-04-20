import { IJSONObject } from '@automatisch/types';
import NewRepository from './triggers/new-repository';
import NewOrganization from './triggers/new-organization';
import NewBranch from './triggers/new-branch';

export default class Triggers {
  newRepository: NewRepository;
  newOrganization: NewOrganization;
  newBranch: NewBranch;

  constructor(connectionData: IJSONObject, parameters: IJSONObject) {
    this.newRepository = new NewRepository(connectionData);
    this.newOrganization = new NewOrganization(connectionData);
    this.newBranch = new NewBranch(connectionData, parameters);
  }
}
