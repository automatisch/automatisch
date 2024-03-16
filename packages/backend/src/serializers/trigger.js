const triggerSerializer = (trigger) => {
  return {
    description: trigger.description,
    key: trigger.key,
    name: trigger.name,
    pollInterval: trigger.pollInterval,
    showWebhookUrl: trigger.showWebhookUrl,
    type: trigger.type,
  };
};

export default triggerSerializer;
