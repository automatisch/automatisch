import { Gitlab } from '@gitbeaker/node';
import type { IJSONObject } from '@automatisch/types';

export default class ListProjects {
  client?: any;

  constructor(connectionData: IJSONObject, parameters?: IJSONObject) {
    if (connectionData?.accessToken) {
      this.client = new Gitlab({
        host: `https://${connectionData.host}`,
        oauthToken: connectionData?.accessToken as string,
      });
    }
  }

  async run() {
    const projects = await this.client.Projects.all({
      membership: true,
    });

    return projects.map((project: any) => ({
      value: project.id,
      name: project.name_with_namespace,
    }));
  }
}
