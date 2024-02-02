export default {
  name: 'List worksheets',
  key: 'listWorksheets',

  async run($) {
    const spreadsheetId = $.step.parameters.spreadsheetId;

    const worksheets = {
      data: [],
    };

    if (!spreadsheetId) {
      return worksheets;
    }

    const params = {
      pageToken: undefined,
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
