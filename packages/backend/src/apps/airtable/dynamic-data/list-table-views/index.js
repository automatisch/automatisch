export default {
  name: 'List table views',
  key: 'listTableViews',

  async run($) {
    const tableViews = {
      data: [],
    };
    const { baseId, tableId } = $.step.parameters;

    if (!baseId) {
      return tableViews;
    }

    const params = {};

    do {
      const { data } = await $.http.get(`/v0/meta/bases/${baseId}/tables`, {
        params,
      });
      params.offset = data.offset;

      if (data?.tables) {
        for (const table of data.tables) {
          if (table.id === tableId) {
            table.views.forEach((view) => {
              tableViews.data.push({
                value: view.id,
                name: view.name,
              });
            });
          }
        }
      }
    } while (params.offset);

    return tableViews;
  },
};
