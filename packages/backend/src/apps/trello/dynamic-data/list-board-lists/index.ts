import { IGlobalVariable, IJSONObject } from '@automatisch/types';

export default {
  name: 'List board lists',
  key: 'listBoardLists',

  async run($: IGlobalVariable) {
    const boards: {
      data: IJSONObject[];
    } = {
      data: [],
    };

    const boardId = $.step.parameters.boardId;

    if (!boardId) {
      return boards;
    }

    const { data } = await $.http.get(`/1/boards/${boardId}/lists`);

    if (data?.length) {
      for (const list of data) {
        boards.data.push({
          value: list.id,
          name: list.name,
        });
      }
    }

    return boards;
  },
};
