import { IGlobalVariable, IJSONObject } from '@automatisch/types';

export default {
  name: 'List worksheets',
  key: 'listWorksheets',

  async run($: IGlobalVariable) {
    const spreadsheetId = $.step.parameters.spreadsheetId as string;

    const worksheets: {
      data: IJSONObject[];
    } = {
      data: [],
    };

    if (!spreadsheetId) {
      return worksheets;
    }

    const params: Record<string, unknown> = {
      pageToken: undefined as unknown as string,
    };

    do {
      const { data } = await $.http.get(`/v4/spreadsheets/${spreadsheetId}`, {
        params,
      });
      params.pageToken = data.nextPageToken;

      if (data.sheets?.length) {
        for (const sheet of data.sheets) {
          worksheets.data.push({
            value: sheet.properties.sheetId,
            name: sheet.properties.title,
          });
        }
      }
    } while (params.pageToken);

    return worksheets;
  },
};
