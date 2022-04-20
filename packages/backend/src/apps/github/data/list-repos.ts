import { Octokit } from 'octokit';
import type { IJSONObject } from '@automatisch/types';

export default class ListRepos {
  client?: Octokit;

  constructor(connectionData: IJSONObject) {
    if (connectionData.accessToken) {
      this.client = new Octokit({
        auth: connectionData.accessToken as string,
      });
    }
  }

  async run() {
    const repos = await this.client.paginate(this.client.rest.repos.listForAuthenticatedUser);

    return repos.map((repo) => ({
      value: repo.full_name,
      name: repo.full_name,
    }));
  }
}
