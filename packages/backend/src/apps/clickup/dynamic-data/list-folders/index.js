export default {
  name: 'List folders',
  key: 'listFolders',

  async run($) {
    const folders = {
      data: [],
    };
    const spaceId = $.step.parameters.spaceId;

    if (!spaceId) {
      return folders;
    }

    const { data } = await $.http.get(`/v2/space/${spaceId}/folder`);

    if (data.folders) {
      for (const folder of data.folders) {
        folders.data.push({
          value: folder.id,
          name: folder.name,
        });
      }
    }

    return folders;
  },
};
