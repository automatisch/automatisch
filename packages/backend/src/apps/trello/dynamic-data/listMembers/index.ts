import { IGlobalVariable, IJSONObject } from '@automatisch/types';

export default {
  name: 'List members',
  key: 'listMembers',

  async run($: IGlobalVariable) {
    const members: {
      data: IJSONObject[];
    } = {
      data: [],
    };

    const boardId = $.step.parameters.boardId;

    if (!boardId) {
      return members;
    }

    const { data } = await $.http.get(`/1/boards/${boardId}/members`);

    if (data?.length) {
      for (const member of data) {
        members.data.push({
          value: member.id,
          name: member.fullName,
        });
      }
    }

    return members;
  },
};
