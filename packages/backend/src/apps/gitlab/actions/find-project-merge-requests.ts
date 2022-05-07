import { Gitlab } from '@gitbeaker/node';
import { IJSONObject } from '@automatisch/types';

export default class FindProjectMergeRequests {
  client: any;
  projectId: number;
  state: string;

  constructor(connectionData: IJSONObject, parameters: IJSONObject) {
    if (connectionData?.accessToken) {
      this.client = new Gitlab({
        host: `https://${connectionData.host}`,
        oauthToken: connectionData?.accessToken as string,
      });
    }

    if (parameters.project) {
      this.projectId = parameters.project as number;
    }

    if (parameters.state) {
      this.state = parameters.state as string;
    }
  }

  async run() {
    const mergeRequests = await this.client.MergeRequests.all({
      state: this.state,
      projectId: this.projectId,
      maxPages: 1,
    });

    return { data: mergeRequests };
  }
}
