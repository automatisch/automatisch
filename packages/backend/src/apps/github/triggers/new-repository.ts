import { Octokit } from 'octokit';
import { DateTime } from 'luxon';
import { IJSONObject } from '@automatisch/types';

export default class NewRepository {
  client?: Octokit;
  connectionData?: IJSONObject;
  baseOptions = {
    visibility: 'all' as const,
    affiliation: 'owner,organization_member,collaborator',
    sort: 'created' as const,
    per_page: 100,
  };

  constructor(connectionData: IJSONObject) {
    if (
      connectionData.consumerKey &&
      connectionData.consumerSecret &&
      connectionData.accessToken
    ) {
      this.client = new Octokit({
        auth: connectionData.accessToken as string,
      });

      this.connectionData = connectionData;
    }
  }

  async run(startTime: Date) {
    const options = {
      ...this.baseOptions,
      since: DateTime.fromJSDate(startTime).toLocaleString(DateTime.TIME_24_SIMPLE),
    };
    return await this.client.paginate(this.client.rest.repos.listForAuthenticatedUser, options);
  }

  async testRun() {
    const options = {
      ...this.baseOptions,
      per_page: 1,
    };
    const { data: repos } = await this.client.rest.repos.listForAuthenticatedUser(options);

    return repos;
  }
}
