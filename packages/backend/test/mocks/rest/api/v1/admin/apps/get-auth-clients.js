const getAdminAppAuthClientsMock = (appAuthClients) => {
  return {
    data: appAuthClients.map((appAuthClient) => ({
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

export default getAdminAppAuthClientsMock;
