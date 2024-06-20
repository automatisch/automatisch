const getConnectionMock = async (connection) => {
  const data = {
    id: connection.id,
    key: connection.key,
    verified: connection.verified,
    reconnectable: connection.reconnectable,
    appAuthClientId: connection.appAuthClientId,
    formattedData: {
      screenName: connection.formattedData.screenName,
    },
    createdAt: connection.createdAt.getTime(),
    updatedAt: connection.updatedAt.getTime(),
  };

  return {
    data: data,
    meta: {
      count: 1,
      currentPage: null,
      isArray: false,
      totalPages: null,
      type: 'Connection',
    },
  };
};

export default getConnectionMock;
