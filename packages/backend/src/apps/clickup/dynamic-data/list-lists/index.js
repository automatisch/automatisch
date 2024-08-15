export default {
  name: 'List lists',
  key: 'listLists',

  async run($) {
    const lists = {
      data: [],
    };
    const folderId = $.step.parameters.folderId;

    if (!folderId) {
      return lists;
    }

    const { data } = await $.http.get(`/v2/folder/${folderId}/list`);

    if (data.lists) {
      for (const list of data.lists) {
        lists.data.push({
          value: list.id,
          name: list.name,
        });
      }
    }

    return lists;
  },
};
