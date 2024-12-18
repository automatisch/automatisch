const getAdminOAuthClientsMock = (oauthClients) => {
  return {
    data: oauthClients.map((oauthClient) => ({
      name: oauthClient.name,
      id: oauthClient.id,
      active: oauthClient.active,
    })),
    meta: {
      count: oauthClients.length,
      currentPage: null,
      isArray: true,
      totalPages: null,
      type: 'OAuthClient',
    },
  };
};

export default getAdminOAuthClientsMock;
