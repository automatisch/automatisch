import { IGlobalVariable, IJSONObject } from '@automatisch/types';

type ResponseBody = {
  data: {
    data: {
      id: number;
      name: string;
    }[];
    links: {
      next: string;
    };
  };
};

export default {
  name: 'List boards',
  key: 'listBoards',

  async run($: IGlobalVariable) {
    const boards: {
      data: IJSONObject[];
    } = {
      data: [],
    };

    let next;
    do {
      const {
        data: { data, links },
      }: ResponseBody = await $.http.get('/v2/boards');

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
