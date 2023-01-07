import { IGlobalVariable, IJSONObject } from '@automatisch/types';

export default {
  name: 'List forms',
  key: 'listForms',

  async run($: IGlobalVariable) {
    const forms: {
      data: IJSONObject[];
    } = {
      data: [],
    };

    const params = {
      q: `mimeType='application/vnd.google-apps.form'`,
      spaces: 'drive',
      pageToken: undefined as unknown as string,
    };

    do {
      const { data } = await $.http.get(`https://www.googleapis.com/drive/v3/files`, { params });
      params.pageToken = data.nextPageToken;

      for (const file of data.files) {
        forms.data.push({
          value: file.id,
          name: file.name,
        });
      }
    } while (params.pageToken);

    return forms;
  },
};
