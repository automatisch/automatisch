import { Octokit } from 'octokit';
import { IJSONObject } from '@automatisch/types';

import { assignOwnerAndRepo } from '../utils';

export default class NewWatcher {
  client?: Octokit;
  repoOwner?: string;
  repo?: string;

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
      owner: this.repoOwner,
      repo: this.repo,
    };
  }

  async run() {
    // TODO: implement pagination on undated entries
    return await this.client.paginate(
      this.client.rest.activity.listWatchersForRepo,
      this.options
    );
  }

  async testRun() {
    return await this.run();
    const options = {
      ...this.options,
      per_page: 1,
    };

    return (await this.client.rest.activity.listWatchersForRepo(options)).data;
  }
}
