import { Octokit } from 'octokit';
import { IJSONObject } from '@automatisch/types';

export default class NewOrganization {
  client?: Octokit;
  baseOptions = {
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
    }
  }

  async run() {
    // TODO: implement pagination on undated entires
    return await this.client.paginate(this.client.rest.orgs.listForAuthenticatedUser);
  }

  async testRun() {
    const { data: orgs } = await this.client.rest.orgs.listForAuthenticatedUser({ per_page: 1 });

    return orgs;
  }
}
