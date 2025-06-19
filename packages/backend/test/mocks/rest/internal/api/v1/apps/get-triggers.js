const getTriggersMock = (triggers) => {
  const triggersData = triggers.map((trigger) => {
    return {
      description: trigger.description,
      key: trigger.key,
      name: trigger.name,
      pollInterval: trigger.pollInterval,
      showWebhookUrl: trigger.showWebhookUrl,
      type: trigger.type,
    };
  });

  return {
    data: triggersData,
    meta: {
      count: triggers.length,
      currentPage: null,
      isArray: true,
      totalPages: null,
      type: 'Object',
    },
  };
};

export default getTriggersMock;
