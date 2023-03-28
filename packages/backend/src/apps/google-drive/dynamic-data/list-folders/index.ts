import { IGlobalVariable, IJSONObject } from '@automatisch/types';

export default {
  name: 'List Folders',
  key: 'listFolders',

  async run($: IGlobalVariable) {
    const folders: {
      data: IJSONObject[];
    } = {
      data: [],
    };

    const params = {
      q: `mimeType='application/vnd.google-apps.folder'`,
      orderBy: 'createdTime desc',
      pageToken: undefined as unknown as string,
      pageSize: 1000,
    };

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
