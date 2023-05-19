import { IGlobalVariable, IJSONObject } from '@automatisch/types';

export default {
  name: 'List spreadsheets',
  key: 'listSpreadsheets',

  async run($: IGlobalVariable) {
    const spreadsheets: {
      data: IJSONObject[];
    } = {
      data: [],
    };

    const params: Record<string, unknown> = {
      q: `mimeType='application/vnd.google-apps.spreadsheet'`,
      pageSize: 100,
      pageToken: undefined as unknown as string,
      orderBy: 'createdTime desc',
      driveId: $.step.parameters.driveId,
      supportsAllDrives: true,
    };

    if ($.step.parameters.driveId) {
      params.includeItemsFromAllDrives = true;
      params.corpora = 'drive';
    }

    do {
      const { data } = await $.http.get(
        `https://www.googleapis.com/drive/v3/files`,
        { params }
      );
      params.pageToken = data.nextPageToken;

      if (data.files?.length) {
        for (const file of data.files) {
          spreadsheets.data.push({
            value: file.id,
            name: file.name,
          });
        }
      }
    } while (params.pageToken);

    return spreadsheets;
  },
};
