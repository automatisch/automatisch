const oauthClientSerializer = (oauthClient) => {
  return {
    id: oauthClient.id,
    appConfigId: oauthClient.appConfigId,
    name: oauthClient.name,
    active: oauthClient.active,
  };
};

export default oauthClientSerializer;
