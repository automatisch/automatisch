import { Octokit } from 'octokit';
import { DateTime } from 'luxon';
import { IJSONObject } from '@automatisch/types';

import { assignOwnerAndRepo } from '../utils';

export default class NewIssue {
  client?: Octokit;
  connectionData?: IJSONObject;
  repoOwner?: string;
  repo?: string;
  hasRepo?: boolean;
  label?: string;
  issueType?: string;

  constructor(connectionData: IJSONObject, parameters: IJSONObject) {
    if (connectionData.accessToken) {
      this.client = new Octokit({
        auth: connectionData.accessToken as string,
      });
    }

    assignOwnerAndRepo(this, parameters?.repo as string);
  }

  get options() {
    return {
      labels: this.label,
    }
  }

  async listRepoIssues(options = {}, paginate = false) {
    const listRepoIssues = this.client.rest.issues.listForRepo;

    const extendedOptions = {
      ...this.options,
      repo: this.repo,
      owner: this.repoOwner,
      filter: this.issueType,
      ...options,
    };

    if (paginate) {
      return await this.client.paginate(listRepoIssues, extendedOptions);
    }

    return (await listRepoIssues(extendedOptions)).data;
  }

  async listIssues(options = {}, paginate = false) {
    const listIssues = this.client.rest.issues.listForAuthenticatedUser;

    const extendedOptions = {
      ...this.options,
      ...options,
    };

    if (paginate) {
      return await this.client.paginate(listIssues, extendedOptions);
    }

    return (await listIssues(extendedOptions)).data;
  }

  async run(startTime: Date) {
    const options = {
      since: DateTime.fromJSDate(startTime).toISO(),
    };

    if (this.hasRepo) {
      return await this.listRepoIssues(options, true);
    }

    return await this.listIssues(options, true);
  }

  async testRun() {
    const options = {
      per_page: 1,
    };

    if (this.hasRepo) {
      return await this.listRepoIssues(options, false);
    }

    return await this.listIssues(options, false);
  }
}
