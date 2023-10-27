import { IGlobalVariable, IJSONObject } from '@automatisch/types';

export default {
  name: 'List board labels',
  key: 'listBoardLabels',

  async run($: IGlobalVariable) {
    const boardLabels: {
      data: IJSONObject[];
    } = {
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
