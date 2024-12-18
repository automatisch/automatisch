const getOAuthClientMock = (oauthClient) => {
  return {
    data: {
      name: oauthClient.name,
      id: oauthClient.id,
      active: oauthClient.active,
    },
    meta: {
      count: 1,
      currentPage: null,
      isArray: false,
      totalPages: null,
      type: 'OAuthClient',
    },
  };
};

export default getOAuthClientMock;
