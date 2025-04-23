const createOAuthClientMock = (oauthClient) => {
  return {
    data: {
      name: oauthClient.name,
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

export default createOAuthClientMock;
