const adminApiTokenSerializer = (apiToken) => {
  return {
    id: apiToken.id,
    token:
      apiToken.token.substring(0, 4) +
      '...' +
      apiToken.token.substring(apiToken.token.length - 4),
    createdAt: apiToken.createdAt.getTime(),
    updatedAt: apiToken.updatedAt.getTime(),
  };
};

export default adminApiTokenSerializer;
