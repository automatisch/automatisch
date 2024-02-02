export default {
  name: 'List board labels',
  key: 'listBoardLabels',

  async run($) {
    const boardLabels = {
      data: [],
    };

    const boardId = $.step.parameters.boardId;

    if (!boardId) {
      return boardLabels;
    }

    const params = {
      fields: 'color',
    };

    const { data } = await $.http.get(`/1/boards/${boardId}/labels`, {
      params,
    });

    if (data?.length) {
      for (const boardLabel of data) {
        boardLabels.data.push({
          value: boardLabel.id,
          name: boardLabel.color,
        });
      }
    }

    return boardLabels;
  },
};
