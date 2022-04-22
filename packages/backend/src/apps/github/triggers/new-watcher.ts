import { Octokit } from 'octokit';
import { IJSONObject } from '@automatisch/types';

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

    if (parameters?.repo) {
      const [owner, repo] = (parameters.repo as string).split('/');

      this.repoOwner = owner;
      this.repo = repo;
    }
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
