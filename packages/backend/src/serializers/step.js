const stepSerializer = (step) => {
  return {
    id: step.id,
    type: step.type,
    key: step.key,
    appKey: step.appKey,
    iconUrl: step.iconUrl,
    webhookUrl: step.webhookUrl,
    status: step.status,
    position: step.position,
    parameters: step.parameters,
  };
};

export default stepSerializer;
