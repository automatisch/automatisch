import { IGlobalVariable, IJSONObject } from '@automatisch/types';

export default {
  name: 'List boards',
  key: 'listBoards',

  async run($: IGlobalVariable) {
    const boards: {
      data: IJSONObject[];
    } = {
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
