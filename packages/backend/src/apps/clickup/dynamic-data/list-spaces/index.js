export default {
  name: 'List spaces',
  key: 'listSpaces',

  async run($) {
    const spaces = {
      data: [],
    };
    const workspaceId = $.step.parameters.workspaceId;

    if (!workspaceId) {
      return spaces;
    }

    const { data } = await $.http.get(`/v2/team/${workspaceId}/space`);

    if (data.spaces) {
      for (const space of data.spaces) {
        spaces.data.push({
          value: space.id,
          name: space.name,
        });
      }
    }

    return spaces;
  },
};
