import { Octokit } from 'octokit';
import { DateTime } from 'luxon';
import { IJSONObject } from '@automatisch/types';

import { assignOwnerAndRepo } from '../utils';

export default class NewMilestone {
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
      state: 'open' as const,
    };
  }

  async run(startTime: Date) {
    const iterator = await this.client.paginate.iterator(this.client.rest.issues.listMilestones, this.options);
    const newMilestones = [];

    const startTimeDateObject = DateTime.fromJSDate(startTime);

    milestoneIterator:
    for await (const { data: milestones } of iterator) {
      for (const milestone of milestones) {
        const createdAtDateObject = DateTime.fromISO(milestone.created_at);

        if (createdAtDateObject < startTimeDateObject) {
          break milestoneIterator;
        }

        newMilestones.push(milestone);
      }
    }

    return newMilestones;
  }

  async testRun() {
    const options = {
      ...this.options,
      per_page: 1,
    };

    return (await this.client.rest.issues.listMilestones(options)).data;
  }
}
