import { IGlobalVariable, IJSONObject } from '@automatisch/types';

type Page = {
  id: string;
  properties: {
    title: {
      title: [
        {
          plain_text: string;
        }
      ];
    };
  };
  parent: {
    workspace: boolean;
  };
};

type ResponseData = {
  results: Page[];
  next_cursor?: string;
};

type Payload = {
  filter: {
    value: 'page';
    property: 'object';
  };
  start_cursor?: string;
};

export default {
  name: 'List parent pages',
  key: 'listParentPages',

  async run($: IGlobalVariable) {
    const parentPages: {
      data: IJSONObject[];
      error: IJSONObject | null;
    } = {
      data: [],
      error: null,
    };
    const payload: Payload = {
      filter: {
        value: 'page',
        property: 'object',
      },
    };

    do {
      const response = await $.http.post<ResponseData>('/v1/search', payload);

      payload.start_cursor = response.data.next_cursor;

      const topLevelPages = response.data.results.filter(
        (page) => page.parent.workspace
      );

      for (const pages of topLevelPages) {
        parentPages.data.push({
          value: pages.id as string,
          name: pages.properties.title.title[0].plain_text as string,
        });
      }
    } while (payload.start_cursor);

    return parentPages;
  },
};
