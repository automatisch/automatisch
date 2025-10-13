export default {
  name: 'List agents',
  key: 'listAgents',

  async run($) {
    const agents = await $.agents.getAll();

    return {
      data: agents.map((agent) => ({
        value: agent.id,
        name: agent.name,
      })),
    };
  },
};
