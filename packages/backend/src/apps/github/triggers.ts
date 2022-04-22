import { IJSONObject } from '@automatisch/types';
import NewRepository from './triggers/new-repository';
import NewOrganization from './triggers/new-organization';
import NewBranch from './triggers/new-branch';
import NewNotification from './triggers/new-notification';
import NewPullRequest from './triggers/new-pull-request';
import NewWatcher from './triggers/new-watcher';
import NewMilestone from './triggers/new-milestone';

export default class Triggers {
  newRepository: NewRepository;
  newOrganization: NewOrganization;
  newBranch: NewBranch;
  newNotification: NewNotification;
  newPullRequest: NewPullRequest;
  newWatcher: NewWatcher;
  newMilestone: NewMilestone;

  constructor(connectionData: IJSONObject, parameters: IJSONObject) {
    this.newRepository = new NewRepository(connectionData);
    this.newOrganization = new NewOrganization(connectionData);
    this.newBranch = new NewBranch(connectionData, parameters);
    this.newNotification = new NewNotification(connectionData, parameters);
    this.newPullRequest = new NewPullRequest(connectionData, parameters);
    this.newWatcher = new NewWatcher(connectionData, parameters);
    this.newMilestone = new NewMilestone(connectionData, parameters);
  }
}
