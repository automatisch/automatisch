export default {
  name: 'List tables',
  key: 'listTables',

  async run($) {
    const tables = {
      data: [],
    };
    const baseId = $.step.parameters.baseId;

    if (!baseId) {
      return tables;
    }

    const params = {};

    do {
      const { data } = await $.http.get(`/v0/meta/bases/${baseId}/tables`, {
        params,
      });
      params.offset = data.offset;

      if (data?.tables) {
        for (const table of data.tables) {
          tables.data.push({
            value: table.id,
            name: table.name,
          });
        }
      }
    } while (params.offset);

    return tables;
  },
};
