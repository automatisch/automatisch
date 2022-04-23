import { Octokit } from 'octokit';
import { DateTime } from 'luxon';
import { IJSONObject } from '@automatisch/types';

import { assignOwnerAndRepo } from '../utils';

export default class NewRelease {
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

  async run(startTime: Date) {
    const iterator = await this.client.paginate.iterator(this.client.rest.repos.listReleases, this.options);
    const newReleases = [];

    const startTimeDateObject = DateTime.fromJSDate(startTime);

    releaseIterator:
    for await (const { data: releases } of iterator) {
      for (const release of releases) {
        const createdAtDateObject = DateTime.fromISO(release.created_at);

        if (createdAtDateObject < startTimeDateObject) {
          break releaseIterator;
        }

        newReleases.push(release);
      }
    }

    return newReleases;
  }

  async testRun() {
    const options = {
      ...this.options,
      per_page: 1,
    };

    return (await this.client.rest.repos.listReleases(options)).data;
  }
}
