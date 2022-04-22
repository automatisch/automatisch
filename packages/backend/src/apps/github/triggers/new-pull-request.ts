import { Octokit } from 'octokit';
import { DateTime } from 'luxon';
import { IJSONObject } from '@automatisch/types';

export default class NewPullRequest {
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
      sort: 'created' as const,
      direction: 'desc' as const,
    };
  }

  async run(startTime: Date) {
    const iterator = await this.client.paginate.iterator(this.client.rest.pulls.list, this.options);
    const newPullRequests = [];

    const startTimeDateObject = DateTime.fromJSDate(startTime);

    pullRequestIterator:
    for await (const { data: pullRequests } of iterator) {
      for (const pullRequest of pullRequests) {
        const createdAtDateObject = DateTime.fromISO(pullRequest.created_at);

        if (createdAtDateObject < startTimeDateObject) {
          break pullRequestIterator;
        }

        newPullRequests.push(pullRequest);
      }
    }

    return newPullRequests;
  }

  async testRun() {
    const options = {
      ...this.options,
      per_page: 1,
    };

    return (await this.client.rest.pulls.list(options)).data;
  }
}
