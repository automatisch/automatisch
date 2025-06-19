export default {
  name: 'List assignees',
  key: 'listAssignees',

  async run($) {
    const assignees = {
      data: [],
    };
    const listId = $.step.parameters.listId;

    if (!listId) {
      return assignees;
    }

    const { data } = await $.http.get(`/v2/list/${listId}/member`);

    if (data.members) {
      for (const member of data.members) {
        assignees.data.push({
          value: member.id,
          name: member.username,
        });
      }
    }

    return assignees;
  },
};
