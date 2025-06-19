const getApiTokensMock = async (apiTokens) => {
  const data = apiTokens.map((apiToken) => {
    return {
      id: apiToken.id,
      token:
        apiToken.token.substring(0, 4) +
        '...' +
        apiToken.token.substring(apiToken.token.length - 4),
      createdAt: apiToken.createdAt.getTime(),
      updatedAt: apiToken.updatedAt.getTime(),
    };
  });

  return {
    data: data,
    meta: {
      count: data.length,
      currentPage: null,
      isArray: true,
      totalPages: null,
      type: 'ApiToken',
    },
  };
};

export default getApiTokensMock;
