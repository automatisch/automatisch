import { IGlobalVariable, IJSONObject } from '@automatisch/types';

export default {
  name: 'List drives',
  key: 'listDrives',

  async run($: IGlobalVariable) {
    const drives: {
      data: IJSONObject[];
    } = {
      data: [{ value: null, name: 'My Google Drive' }],
    };

    const params = {
      pageSize: 100,
      pageToken: undefined as unknown as string,
    };

    do {
      const { data } = await $.http.get(`/v3/drives`, { params });
      params.pageToken = data.nextPageToken;

      if (data.drives) {
        for (const drive of data.drives) {
          drives.data.push({
            value: drive.id,
            name: drive.name,
          });
        }
      }
    } while (params.pageToken);

    return drives;
  },
};
