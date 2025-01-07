const updateStepMock = (step) => {
  const data = {
    id: step.id,
    type: step.type || 'action',
    key: step.key || null,
    name: step.name || null,
    appKey: step.appKey || null,
    iconUrl: step.iconUrl || null,
    webhookUrl: step.webhookUrl || null,
    status: step.status || 'incomplete',
    position: step.position,
    parameters: step.parameters || {},
  };

  return {
    data,
    meta: {
      type: 'Step',
      count: 1,
      isArray: false,
      currentPage: null,
      totalPages: null,
    },
  };
};

export default updateStepMock;
