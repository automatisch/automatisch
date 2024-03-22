const getAppAuthClientsMock = (appAuthClients) => {
  return {
    data: appAuthClients.map((appAuthClient) => ({
      appConfigId: appAuthClient.appConfigId,
      name: appAuthClient.name,
      id: appAuthClient.id,
      active: appAuthClient.active,
    })),
    meta: {
      count: appAuthClients.length,
      currentPage: null,
      isArray: true,
      totalPages: null,
      type: 'AppAuthClient',
    },
  };
};

export default getAppAuthClientsMock;
