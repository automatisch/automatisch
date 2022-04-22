import { Octokit } from 'octokit';
import { DateTime } from 'luxon';
import { IJSONObject } from '@automatisch/types';

export default class NewCommitComment {
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

  async run(startTime: Date) {
    const iterator = await this.client.paginate.iterator(this.client.rest.repos.listCommitCommentsForRepo, this.options);
    const newCommitComments = [];

    const startTimeDateObject = DateTime.fromJSDate(startTime);

    commitCommentIterator:
    for await (const { data: commitComments } of iterator) {
      for (const commitComment of commitComments) {
        const createdAtDateObject = DateTime.fromISO(commitComment.created_at);

        if (createdAtDateObject < startTimeDateObject) {
          break commitCommentIterator;
        }

        newCommitComments.push(commitComment);
      }
    }

    return newCommitComments;
  }

  async testRun() {
    const options = {
      ...this.options,
      per_page: 1,
    };

    return (await this.client.rest.repos.listCommitCommentsForRepo(options)).data;
  }
}
