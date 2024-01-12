export default {
  name: 'List boards',
  key: 'listBoards',

  async run($) {
    const boards = {
      data: [],
    };

    let next;
    do {
      const {
        data: { data, links },
      } = await $.http.get('/v2/boards');

      next = links?.next;

      if (data.length) {
        for (const board of data) {
          boards.data.push({
            value: board.id,
            name: board.name,
          });
        }
      }
    } while (next);

    return boards;
  },
};
