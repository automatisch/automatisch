import { IJSONObject } from '@automatisch/types';
import FindProjectMergeRequests from './actions/find-project-merge-requests';

export default class Actions {
  findProjectMergeRequests: FindProjectMergeRequests;

  constructor(connectionData: IJSONObject, parameters: IJSONObject) {
    this.findProjectMergeRequests = new FindProjectMergeRequests(
      connectionData,
      parameters
    );
  }
}
