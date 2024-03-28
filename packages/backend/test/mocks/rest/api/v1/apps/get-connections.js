const getConnectionsMock = (connections) => {
  return {
    data: connections.map((connection) => ({
      id: connection.id,
      key: connection.key,
      reconnectable: connection.reconnectable,
      verified: connection.verified,
      appAuthClientId: connection.appAuthClientId,
      formattedData: {
        screenName: connection.formattedData.screenName,
      },
      createdAt: connection.createdAt.getTime(),
      updatedAt: connection.updatedAt.getTime(),
    })),
    meta: {
      count: connections.length,
      currentPage: null,
      isArray: true,
      totalPages: null,
      type: 'Connection',
    },
  };
};

export default getConnectionsMock;
