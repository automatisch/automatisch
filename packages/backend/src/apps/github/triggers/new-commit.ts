import { Octokit } from 'octokit';
import { DateTime } from 'luxon';
import { IJSONObject } from '@automatisch/types';

import { assignOwnerAndRepo } from '../utils';

export default class NewCommit {
  client?: Octokit;
  repoOwner?: string;
  repo?: string;
  head?: string;

  constructor(connectionData: IJSONObject, parameters: IJSONObject) {
    if (connectionData.accessToken) {
      this.client = new Octokit({
        auth: connectionData.accessToken as string,
      });
    }

    if (parameters?.head) {
      this.head = parameters.head as string;
    }

    assignOwnerAndRepo(this, parameters?.repo as string);
  }

  get options() {
    const options = {
      owner: this.repoOwner,
      repo: this.repo,
    };

    if (this.head) {
      return {
        ...options,
        sha: this.head,
      };
    }

    return options;
  }

  async run(startTime: Date) {
    const options = {
      ...this.options,
      since: DateTime.fromJSDate(startTime).toISO(),
    };
    return await this.client.paginate(this.client.rest.repos.listCommits, options);
  }

  async testRun() {
    const options = {
      ...this.options,
      per_page: 1,
    };

    return (await this.client.rest.repos.listCommits(options)).data;
  }
}
