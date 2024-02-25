const appAuthClientSerializer = (appAuthClient) => {
  return {
    id: appAuthClient.id,
    appConfigId: appAuthClient.appConfigId,
    name: appAuthClient.name,
    active: appAuthClient.active,
  };
};

export default appAuthClientSerializer;
