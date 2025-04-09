const getApiTokensMock = async (apiTokens) => {
  const data = apiTokens.map((apiToken) => {
    return {
      id: apiToken.id,
      token: apiToken.token,
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
