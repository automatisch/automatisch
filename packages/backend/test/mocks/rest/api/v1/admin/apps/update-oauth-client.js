const updateOAuthClientMock = (oauthClient) => {
  return {
    data: {
      id: oauthClient.id,
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

export default updateOAuthClientMock;
