const getActionsMock = (actions) => {
  const actionsData = actions.map((trigger) => {
    return {
      name: trigger.name,
      key: trigger.key,
      description: trigger.description,
    };
  });

  return {
    data: actionsData,
    meta: {
      count: actions.length,
      currentPage: null,
      isArray: true,
      totalPages: null,
      type: 'Object',
    },
  };
};

export default getActionsMock;
