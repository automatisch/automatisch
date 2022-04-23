import { Octokit } from 'octokit';
import { DateTime } from 'luxon';
import { IJSONObject } from '@automatisch/types';

import { assignOwnerAndRepo } from '../utils';

export default class NewNotification {
  client?: Octokit;
  connectionData?: IJSONObject;
  repoOwner?: string;
  repo?: string;
  baseOptions = {
    all: true,
    participating: false,
  };

  constructor(connectionData: IJSONObject, parameters: IJSONObject) {
    if (connectionData.accessToken) {
      this.client = new Octokit({
        auth: connectionData.accessToken as string,
      });
    }

    assignOwnerAndRepo(this, parameters?.repo as string);
  }

  get hasRepo() {
    return this.repoOwner && this.repo;
  }

  async listRepoNotifications(options = {}, paginate = false) {
    const listRepoNotifications = this.client.rest.activity.listRepoNotificationsForAuthenticatedUser;

    const extendedOptions = {
      ...this.baseOptions,
      repo: this.repo,
      owner: this.repoOwner,
      ...options,
    };

    if (paginate) {
      return await this.client.paginate(listRepoNotifications, extendedOptions);
    }

    return (await listRepoNotifications(extendedOptions)).data;
  }

  async listNotifications(options = {}, paginate = false) {
    const listNotifications = this.client.rest.activity.listNotificationsForAuthenticatedUser;

    const extendedOptions = {
      ...this.baseOptions,
      ...options,
    };

    if (paginate) {
      return await this.client.paginate(listNotifications, extendedOptions);
    }

    return (await listNotifications(extendedOptions)).data;
  }

  async run(startTime: Date) {
    const options = {
      since: DateTime.fromJSDate(startTime).toISO(),
    };

    if (this.hasRepo) {
      return await this.listRepoNotifications(options, true);
    }

    return await this.listNotifications(options, true);
  }

  async testRun() {
    const options = {
      per_page: 1,
    };

    if (this.hasRepo) {
      return await this.listRepoNotifications(options, false);
    }

    return await this.listNotifications(options, false);
  }
}
