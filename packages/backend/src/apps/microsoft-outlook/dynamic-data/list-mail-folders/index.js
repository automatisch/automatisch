export default {
  name: 'List Mail Folders',
  key: 'listMailFolders',

  async run($) {
    const mailFolders = {
      data: [],
    };

    let nextLink = '/v1.0/me/mailFolders';

    do {
      const response = await $.http.get(nextLink);
      const data = response.data;

      if (data.value) {
        for (const folder of data.value) {
          mailFolders.data.push({
            value: folder.id,
            name: folder.displayName,
          });
        }
      }

      nextLink = data['@odata.nextLink'];

    } while (nextLink);

    return mailFolders;
  },
};
