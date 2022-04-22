import { Octokit } from 'octokit';
import { DateTime } from 'luxon';
import { IJSONObject } from '@automatisch/types';

export default class NewRepository {
  client?: Octokit;
  connectionData?: IJSONObject;

  constructor(connectionData: IJSONObject) {
    if (connectionData.accessToken) {
      this.client = new Octokit({
        auth: connectionData.accessToken as string,
      });
    }
  }

  async run(startTime: Date) {
    const options = {
      since: DateTime.fromJSDate(startTime).toISO(),
    };
    return await this.client.paginate(this.client.rest.repos.listForAuthenticatedUser, options);
  }

  async testRun() {
    const options = {
      per_page: 1,
    };
    const { data: repos } = await this.client.rest.repos.listForAuthenticatedUser(options);

    return repos;
  }
}
