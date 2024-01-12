export default {
  name: 'List members',
  key: 'listMembers',

  async run($) {
    const members = {
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
