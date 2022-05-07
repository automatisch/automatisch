import { Octokit } from 'octokit';
import type { IJSONObject } from '@automatisch/types';

import { assignOwnerAndRepo } from '../utils';

export default class ListLabels {
  client?: Octokit;
  repoOwner?: string;
  repo?: string;

  constructor(connectionData: IJSONObject, parameters?: IJSONObject) {
    if (connectionData.accessToken) {
      this.client = new Octokit({
        auth: connectionData.accessToken as string,
      });
    }

    assignOwnerAndRepo(this, parameters?.repo as string);
  }

  get options() {
    return {
      owner: this.repoOwner,
      repo: this.repo,
    };
  }

  async run() {
    const labels = await this.client.paginate(this.client.rest.issues.listLabelsForRepo, this.options);

    return labels.map((label) => ({
      value: label.name,
      name: label.name,
    }));
  }
}
