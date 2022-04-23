import { IJSONObject } from '@automatisch/types';
import NewRepository from './triggers/new-repository';
import NewOrganization from './triggers/new-organization';
import NewBranch from './triggers/new-branch';
import NewNotification from './triggers/new-notification';
import NewPullRequest from './triggers/new-pull-request';
import NewWatcher from './triggers/new-watcher';
import NewMilestone from './triggers/new-milestone';
import NewCommit from './triggers/new-commit';
import NewCommitComment from './triggers/new-commit-comment';
import NewLabel from './triggers/new-label';
import NewCollaborator from './triggers/new-collaborator';
import NewRelease from './triggers/new-release';

export default class Triggers {
  newRepository: NewRepository;
  newOrganization: NewOrganization;
  newBranch: NewBranch;
  newNotification: NewNotification;
  newPullRequest: NewPullRequest;
  newWatcher: NewWatcher;
  newMilestone: NewMilestone;
  newCommit: NewCommit;
  newCommitComment: NewCommitComment;
  newLabel: NewLabel;
  newCollaborator: NewCollaborator;
  newRelease: NewRelease;

  constructor(connectionData: IJSONObject, parameters: IJSONObject) {
    this.newRepository = new NewRepository(connectionData);
    this.newOrganization = new NewOrganization(connectionData);
    this.newBranch = new NewBranch(connectionData, parameters);
    this.newNotification = new NewNotification(connectionData, parameters);
    this.newPullRequest = new NewPullRequest(connectionData, parameters);
    this.newWatcher = new NewWatcher(connectionData, parameters);
    this.newMilestone = new NewMilestone(connectionData, parameters);
    this.newCommit = new NewCommit(connectionData, parameters);
    this.newCommitComment = new NewCommitComment(connectionData, parameters);
    this.newLabel = new NewLabel(connectionData, parameters);
    this.newCollaborator = new NewCollaborator(connectionData, parameters);
    this.newRelease = new NewRelease(connectionData, parameters);
  }
}
