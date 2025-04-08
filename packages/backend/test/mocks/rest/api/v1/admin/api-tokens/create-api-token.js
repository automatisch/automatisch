const createApiTokenMock = async (apiToken) => {
  const data = {
    id: apiToken.id,
    token: apiToken.token,
    createdAt: apiToken.createdAt.getTime(),
    updatedAt: apiToken.updatedAt.getTime(),
  };

  return {
    data: data,
    meta: {
      count: 1,
      currentPage: null,
      isArray: false,
      totalPages: null,
      type: 'ApiToken',
    },
  };
};

export default createApiTokenMock;
