const connectionSerializer = (connection) => {
  return {
    id: connection.id,
    key: connection.key,
    reconnectable: connection.reconnectable,
    appAuthClientId: connection.appAuthClientId,
    formattedData: {
      screenName: connection.formattedData.screenName,
    },
    verified: connection.verified,
    createdAt: connection.createdAt.getTime(),
    updatedAt: connection.updatedAt.getTime(),
  };
};

export default connectionSerializer;
