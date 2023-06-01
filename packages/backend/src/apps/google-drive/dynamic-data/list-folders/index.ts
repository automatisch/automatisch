import { IGlobalVariable, IJSONObject } from '@automatisch/types';

export default {
  name: 'List folders',
  key: 'listFolders',

  async run($: IGlobalVariable) {
    const folders: {
      data: IJSONObject[];
    } = {
      data: [],
    };

    const params: Record<string, unknown> = {
      q: `mimeType='application/vnd.google-apps.folder'`,
      orderBy: 'createdTime desc',
      pageToken: undefined as unknown as string,
      pageSize: 1000,
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
        {
          params,
        }
      );
      params.pageToken = data.nextPageToken;

      for (const file of data.files) {
        folders.data.push({
          value: file.id,
          name: file.name,
        });
      }
    } while (params.pageToken);

    return folders;
  },
};
