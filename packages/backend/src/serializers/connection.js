const connectionSerializer = (connection) => {
  return {
    id: connection.id,
    key: connection.key,
    oauthClientId: connection.oauthClientId,
    formattedData: {
      screenName: connection.formattedData.screenName,
    },
    verified: connection.verified,
    createdAt: connection.createdAt.getTime(),
    updatedAt: connection.updatedAt.getTime(),
  };
};

export default connectionSerializer;
