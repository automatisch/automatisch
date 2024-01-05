export default {
  name: 'List boards',
  key: 'listBoards',

  async run($) {
    const boards = {
      data: [],
    };

    const { data } = await $.http.get(`/1/members/me/boards`);

    if (data?.length) {
      for (const board of data) {
        boards.data.push({
          value: board.id,
          name: board.name,
        });
      }
    }

    return boards;
  },
};
