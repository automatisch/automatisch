export default {
  name: 'List boards',
  key: 'listBoards',

  async run($) {
    const boards = {
      data: [],
    };

    const body = {
      query: `
        query {
          boards {
            id
            name
            type
          }
        }
      `,
    };

    const { data } = await $.http.post('/', body);

    if (data.data.boards?.length) {
      for (const board of data.data.boards) {
        if (board.type === 'board') {
          boards.data.push({
            value: board.id,
            name: board.name,
          });
        }
      }
    }

    return boards;
  },
};
