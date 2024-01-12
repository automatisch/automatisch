export default {
  name: 'List drives',
  key: 'listDrives',

  async run($) {
    const drives = {
      data: [{ value: null, name: 'My Google Drive' }],
    };

    const params = {
      pageSize: 100,
      pageToken: undefined,
    };

    do {
      const { data } = await $.http.get(
        `https://www.googleapis.com/drive/v3/drives`,
        { params }
      );
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
