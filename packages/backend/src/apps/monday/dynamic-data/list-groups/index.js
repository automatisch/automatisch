export default {
  name: 'List groups',
  key: 'listGroups',

  async run($) {
    const groups = {
      data: [],
    };
    const boardId = $.step.parameters.parameters.boardId;

    if (!boardId) {
      return groups;
    }

    const body = {
      query: `query {
          boards (ids: ${boardId}) {
            groups {
              title
              id
            }
          }
        }
      `,
    };

    const { data } = await $.http.post('/', body);

    if (data.data.boards[0].groups.length) {
      for (const group of data.data.boards[0].groups) {
        groups.data.push({
          value: group.id,
          name: group.title,
        });
      }
    }

    return groups;
  },
};
