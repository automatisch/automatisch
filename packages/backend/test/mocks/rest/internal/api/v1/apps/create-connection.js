const createConnection = (connection) => {
  const connectionData = {
    id: connection.id,
    key: connection.key,
    oauthClientId: connection.oauthClientId,
    formattedData: connection.formattedData,
    verified: connection.verified || false,
    createdAt: connection.createdAt.getTime(),
    updatedAt: connection.updatedAt.getTime(),
  };

  return {
    data: connectionData,
    meta: {
      count: 1,
      currentPage: null,
      isArray: false,
      totalPages: null,
      type: 'Connection',
    },
  };
};

export default createConnection;
