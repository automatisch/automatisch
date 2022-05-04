import { Octokit } from 'octokit';
import type { IJSONObject } from '@automatisch/types';

import { assignOwnerAndRepo } from '../utils';

export default class ListBranches {
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
    const branches = await this.client.paginate(this.client.rest.repos.listBranches, this.options);

    return branches.map((branch) => ({
      value: branch.name,
      name: branch.name,
    }));
  }
}
